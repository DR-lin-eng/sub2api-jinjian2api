package service

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"image"
	"image/color"
	stddraw "image/draw"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"log/slog"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	xdraw "golang.org/x/image/draw"
	"golang.org/x/sync/singleflight"
)

var (
	ErrUserNotFound      = infraerrors.NotFound("USER_NOT_FOUND", "user not found")
	ErrPasswordIncorrect = infraerrors.BadRequest("PASSWORD_INCORRECT", "current password is incorrect")
	ErrInsufficientPerms = infraerrors.Forbidden("INSUFFICIENT_PERMISSIONS", "insufficient permissions")
	ErrAvatarInvalid     = infraerrors.BadRequest("AVATAR_INVALID", "avatar must be a valid image data URL or http(s) URL")
	ErrAvatarTooLarge    = infraerrors.BadRequest("AVATAR_TOO_LARGE", "avatar image must be 100KB or smaller")
	ErrAvatarNotImage    = infraerrors.BadRequest("AVATAR_NOT_IMAGE", "avatar content must be an image")
)

const (
	maxInlineAvatarBytes      = 100 * 1024
	targetAvatarBytes         = 20 * 1024
	userLastActiveMinTouch    = 10 * time.Minute
	userLastActiveFailBackoff = 30 * time.Second
)

var (
	avatarScaleSteps   = []float64{1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44, 0.36}
	avatarQualitySteps = []int{88, 80, 72, 64, 56, 48, 40, 32}
)

// UserUpdateFields 声明 UserRepository.Update 允许写回的列。
type UserUpdateFields struct {
	Username     bool
	PasswordHash bool
	Status       bool
	LastLoginAt  bool
	LastActiveAt bool
}

// IsEmpty 报告该次 Update 是否不写任何列（此时仓储直接返回，不产生写操作）。
func (f UserUpdateFields) IsEmpty() bool {
	return f == UserUpdateFields{}
}

type UserRepository interface {
	GetByID(ctx context.Context, id int64) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetFirstAdmin(ctx context.Context) (*User, error)
	// Update 只写 fields 中显式声明的列，其余列保持库中当前值。
	Update(ctx context.Context, user *User, fields UserUpdateFields) error
	GetUserAvatar(ctx context.Context, userID int64) (*UserAvatar, error)
	UpsertUserAvatar(ctx context.Context, userID int64, input UpsertUserAvatarInput) (*UserAvatar, error)
	DeleteUserAvatar(ctx context.Context, userID int64) error
	UpdateUserLastActiveAt(ctx context.Context, userID int64, activeAt time.Time) error
	// TOTP 双因素认证
	UpdateTotpSecret(ctx context.Context, userID int64, encryptedSecret *string) error
	EnableTotp(ctx context.Context, userID int64) error
	DisableTotp(ctx context.Context, userID int64) error
}

// UpdateProfileRequest 更新用户资料请求
type UpdateProfileRequest struct {
	Username  *string `json:"username"`
	AvatarURL *string `json:"avatar_url"`
}

type UserAvatar struct {
	StorageProvider string
	StorageKey      string
	URL             string
	ContentType     string
	ByteSize        int
	SHA256          string
}

type UpsertUserAvatarInput struct {
	StorageProvider string
	StorageKey      string
	URL             string
	ContentType     string
	ByteSize        int
	SHA256          string
}

type userProfileTxRunner interface {
	WithUserProfileTx(ctx context.Context, fn func(txCtx context.Context) error) error
}

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

// UserService 用户服务
type UserService struct {
	userRepo          UserRepository
	lastActiveTouchL1 sync.Map
	lastActiveTouchSF singleflight.Group
}

// NewUserService 创建用户服务实例
func NewUserService(userRepo UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

// GetFirstAdmin 获取首个管理员用户（用于 Admin API Key 认证）
func (s *UserService) GetFirstAdmin(ctx context.Context) (*User, error) {
	admin, err := s.userRepo.GetFirstAdmin(ctx)
	if err != nil {
		return nil, fmt.Errorf("get first admin: %w", err)
	}
	return admin, nil
}

// GetProfile 获取用户资料
func (s *UserService) GetProfile(ctx context.Context, userID int64) (*User, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}
	normalizeLoadedUserTokenVersion(user)
	if err := s.hydrateUserAvatar(ctx, user); err != nil {
		return nil, fmt.Errorf("get user avatar: %w", err)
	}
	return user, nil
}

// UpdateProfile 更新用户资料
func (s *UserService) UpdateProfile(ctx context.Context, userID int64, req UpdateProfileRequest) (*User, error) {
	if txRunner, ok := s.userRepo.(userProfileTxRunner); ok {
		var updated *User
		if err := txRunner.WithUserProfileTx(ctx, func(txCtx context.Context) error {
			var err error
			updated, err = s.updateProfile(txCtx, userID, req)
			return err
		}); err != nil {
			return nil, err
		}
		return updated, nil
	}
	return s.updateProfile(ctx, userID, req)
}

func (s *UserService) updateProfile(ctx context.Context, userID int64, req UpdateProfileRequest) (*User, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}

	var fields UserUpdateFields

	if req.Username != nil {
		user.Username = *req.Username
		fields.Username = true
	}

	if req.AvatarURL != nil {
		avatar, err := s.SetAvatar(ctx, userID, *req.AvatarURL)
		if err != nil {
			return nil, err
		}
		applyUserAvatar(user, avatar)
	}

	if err := s.userRepo.Update(ctx, user, fields); err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	return user, nil
}

func (s *UserService) SetAvatar(ctx context.Context, userID int64, raw string) (*UserAvatar, error) {
	avatarValue := strings.TrimSpace(raw)
	if avatarValue == "" {
		if err := s.userRepo.DeleteUserAvatar(ctx, userID); err != nil {
			return nil, fmt.Errorf("delete avatar: %w", err)
		}
		return nil, nil
	}

	avatarInput, err := normalizeUserAvatarInput(avatarValue)
	if err != nil {
		return nil, err
	}

	avatar, err := s.userRepo.UpsertUserAvatar(ctx, userID, avatarInput)
	if err != nil {
		return nil, fmt.Errorf("upsert avatar: %w", err)
	}
	return avatar, nil
}

func applyUserAvatar(user *User, avatar *UserAvatar) {
	if user == nil {
		return
	}
	if avatar == nil {
		user.AvatarURL = ""
		user.AvatarSource = ""
		user.AvatarMIME = ""
		user.AvatarByteSize = 0
		user.AvatarSHA256 = ""
		return
	}

	user.AvatarURL = avatar.URL
	user.AvatarSource = avatar.StorageProvider
	user.AvatarMIME = avatar.ContentType
	user.AvatarByteSize = avatar.ByteSize
	user.AvatarSHA256 = avatar.SHA256
}

func normalizeUserAvatarInput(raw string) (UpsertUserAvatarInput, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}
	if strings.HasPrefix(raw, "data:") {
		return normalizeInlineUserAvatarInput(raw)
	}

	parsed, err := url.Parse(raw)
	if err != nil || parsed == nil {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}
	if !strings.EqualFold(parsed.Scheme, "http") && !strings.EqualFold(parsed.Scheme, "https") {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}
	if strings.TrimSpace(parsed.Host) == "" {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}

	return UpsertUserAvatarInput{
		StorageProvider: "remote_url",
		URL:             raw,
	}, nil
}

func ValidateUserAvatar(raw string) error {
	_, err := normalizeUserAvatarInput(raw)
	return err
}

func normalizeInlineUserAvatarInput(raw string) (UpsertUserAvatarInput, error) {
	body := strings.TrimPrefix(raw, "data:")
	meta, encoded, ok := strings.Cut(body, ",")
	if !ok {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}
	meta = strings.TrimSpace(meta)
	encoded = strings.TrimSpace(encoded)
	if !strings.HasSuffix(strings.ToLower(meta), ";base64") {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}

	contentType := strings.TrimSpace(meta[:len(meta)-len(";base64")])
	if contentType == "" || !strings.HasPrefix(strings.ToLower(contentType), "image/") {
		return UpsertUserAvatarInput{}, ErrAvatarNotImage
	}

	decoded, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return UpsertUserAvatarInput{}, ErrAvatarInvalid
	}
	if len(decoded) > maxInlineAvatarBytes {
		return UpsertUserAvatarInput{}, ErrAvatarTooLarge
	}

	if len(decoded) > targetAvatarBytes {
		decoded, contentType, err = compressInlineAvatar(decoded)
		if err != nil {
			return UpsertUserAvatarInput{}, err
		}
		raw = "data:" + contentType + ";base64," + base64.StdEncoding.EncodeToString(decoded)
	}

	sum := sha256.Sum256(decoded)
	return UpsertUserAvatarInput{
		StorageProvider: "inline",
		URL:             raw,
		ContentType:     contentType,
		ByteSize:        len(decoded),
		SHA256:          hex.EncodeToString(sum[:]),
	}, nil
}

func compressInlineAvatar(decoded []byte) ([]byte, string, error) {
	src, _, err := image.Decode(bytes.NewReader(decoded))
	if err != nil {
		return nil, "", ErrAvatarInvalid
	}

	srcBounds := src.Bounds()
	if srcBounds.Empty() {
		return nil, "", ErrAvatarInvalid
	}

	for _, scale := range avatarScaleSteps {
		width := max(1, int(float64(srcBounds.Dx())*scale))
		height := max(1, int(float64(srcBounds.Dy())*scale))
		dst := image.NewRGBA(image.Rect(0, 0, width, height))
		stddraw.Draw(dst, dst.Bounds(), &image.Uniform{C: color.White}, image.Point{}, stddraw.Src)
		xdraw.CatmullRom.Scale(dst, dst.Bounds(), src, srcBounds, stddraw.Over, nil)

		for _, quality := range avatarQualitySteps {
			var buf bytes.Buffer
			if err := jpeg.Encode(&buf, dst, &jpeg.Options{Quality: quality}); err != nil {
				return nil, "", ErrAvatarInvalid
			}
			if buf.Len() <= targetAvatarBytes {
				return buf.Bytes(), "image/jpeg", nil
			}
		}
	}

	return nil, "", ErrAvatarTooLarge
}

// ChangePassword 修改密码
// Security: Increments TokenVersion to invalidate all existing JWT tokens
func (s *UserService) ChangePassword(ctx context.Context, userID int64, req ChangePasswordRequest) error {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("get user: %w", err)
	}

	// 验证当前密码
	if !user.CheckPassword(req.CurrentPassword) {
		return ErrPasswordIncorrect
	}

	if err := user.SetPassword(req.NewPassword); err != nil {
		return fmt.Errorf("set password: %w", err)
	}

	// Increment TokenVersion to invalidate all existing tokens
	// This ensures that any tokens issued before the password change become invalid
	user.TokenVersion++

	// TokenVersion 没有对应的数据库列（见 resolvedTokenVersion：它由 email+password_hash
	// 指纹推导），改密写回 password_hash 即可让旧 token 失效。
	if err := s.userRepo.Update(ctx, user, UserUpdateFields{PasswordHash: true}); err != nil {
		return fmt.Errorf("update user: %w", err)
	}

	return nil
}

// GetByID 根据ID获取用户（管理员功能）
func (s *UserService) GetByID(ctx context.Context, id int64) (*User, error) {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}
	normalizeLoadedUserTokenVersion(user)
	if err := s.hydrateUserAvatar(ctx, user); err != nil {
		return nil, fmt.Errorf("get user avatar: %w", err)
	}
	return user, nil
}

func normalizeLoadedUserTokenVersion(user *User) {
	if user == nil || user.TokenVersionResolved {
		return
	}
	user.TokenVersion = resolvedTokenVersion(user)
	user.TokenVersionResolved = true
}

// TouchLastActive 通过防抖更新 users.last_active_at，减少鉴权热路径写放大。
// 该操作为尽力而为，不应中断正常请求。
func (s *UserService) TouchLastActive(ctx context.Context, userID int64) {
	if s == nil || s.userRepo == nil || userID <= 0 {
		return
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		slog.Debug("skip touch user last active after load failure", "user_id", userID, "error", err)
		return
	}
	s.TouchLastActiveForUser(ctx, user)
}

// TouchLastActiveForUser 使用已加载的用户信息更新 last_active_at，避免重复读取数据库。
func (s *UserService) TouchLastActiveForUser(ctx context.Context, user *User) {
	if s == nil || s.userRepo == nil || user == nil || user.ID <= 0 {
		return
	}

	now := time.Now()
	if userLastActiveFresh(user.LastActiveAt, now) {
		return
	}
	if v, ok := s.lastActiveTouchL1.Load(user.ID); ok {
		if nextAllowedAt, ok := v.(time.Time); ok && now.Before(nextAllowedAt) {
			return
		}
		s.lastActiveTouchL1.Delete(user.ID)
	}

	_, err, _ := s.lastActiveTouchSF.Do(strconv.FormatInt(user.ID, 10), func() (any, error) {
		latest := time.Now()
		if v, ok := s.lastActiveTouchL1.Load(user.ID); ok {
			if nextAllowedAt, ok := v.(time.Time); ok && latest.Before(nextAllowedAt) {
				return nil, nil
			}
			s.lastActiveTouchL1.Delete(user.ID)
		}
		if userLastActiveFresh(user.LastActiveAt, latest) {
			return nil, nil
		}
		if err := s.userRepo.UpdateUserLastActiveAt(ctx, user.ID, latest); err != nil {
			s.lastActiveTouchL1.Store(user.ID, latest.Add(userLastActiveFailBackoff))
			return nil, fmt.Errorf("touch user last active: %w", err)
		}
		s.lastActiveTouchL1.Store(user.ID, latest.Add(userLastActiveMinTouch))
		return nil, nil
	})
	if err != nil {
		slog.Warn("touch user last active failed", "user_id", user.ID, "error", err)
	}
}

func userLastActiveFresh(lastActiveAt *time.Time, now time.Time) bool {
	if lastActiveAt == nil {
		return false
	}
	return now.Before(lastActiveAt.Add(userLastActiveMinTouch))
}

func (s *UserService) hydrateUserAvatar(ctx context.Context, user *User) error {
	if s == nil || s.userRepo == nil || user == nil || user.ID == 0 {
		return nil
	}

	avatar, err := s.userRepo.GetUserAvatar(ctx, user.ID)
	if err != nil {
		return err
	}
	applyUserAvatar(user, avatar)
	return nil
}

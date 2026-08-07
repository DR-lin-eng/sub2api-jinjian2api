package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/logger"
	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidCredentials  = infraerrors.Unauthorized("INVALID_CREDENTIALS", "invalid email or password")
	ErrUserNotActive       = infraerrors.Forbidden("USER_NOT_ACTIVE", "user is not active")
	ErrInvalidToken        = infraerrors.Unauthorized("INVALID_TOKEN", "invalid token")
	ErrTokenExpired        = infraerrors.Unauthorized("TOKEN_EXPIRED", "token has expired")
	ErrTokenTooLarge       = infraerrors.BadRequest("TOKEN_TOO_LARGE", "token too large")
	ErrTokenRevoked        = infraerrors.Unauthorized("TOKEN_REVOKED", "token has been revoked")
	ErrRefreshTokenInvalid = infraerrors.Unauthorized("REFRESH_TOKEN_INVALID", "invalid refresh token")
	ErrRefreshTokenExpired = infraerrors.Unauthorized("REFRESH_TOKEN_EXPIRED", "refresh token has expired")
	ErrServiceUnavailable  = infraerrors.ServiceUnavailable("SERVICE_UNAVAILABLE", "service temporarily unavailable")
)

const (
	maxTokenLength = 8192

	// MinimumRefreshTokenSessionDays keeps browser sessions restorable for at
	// least one week unless they are explicitly revoked.
	MinimumRefreshTokenSessionDays = 7
	refreshTokenPrefix             = "rt_"
)

// JWTClaims is the local administrator access-token payload.
type JWTClaims struct {
	UserID       int64  `json:"user_id"`
	Email        string `json:"email"`
	Role         string `json:"role"`
	TokenVersion int64  `json:"token_version"`
	SessionID    string `json:"sid,omitempty"`
	BindingHash  string `json:"bnd,omitempty"`
	jwt.RegisteredClaims
}

// AuthService owns only local administrator authentication and session rotation.
type AuthService struct {
	userRepo          UserRepository
	refreshTokenCache RefreshTokenCache
	cfg               *config.Config
	settingService    *SettingService
}

func NewAuthService(
	userRepo UserRepository,
	refreshTokenCache RefreshTokenCache,
	cfg *config.Config,
	settingService *SettingService,
) *AuthService {
	return &AuthService{
		userRepo:          userRepo,
		refreshTokenCache: refreshTokenCache,
		cfg:               cfg,
		settingService:    settingService,
	}
}

// Login authenticates an existing local account. The HTTP boundary enforces
// that only the administrator role can establish a panel session.
func (s *AuthService) Login(ctx context.Context, email, password string) (string, *User, error) {
	user, err := s.userRepo.GetByEmail(ctx, strings.TrimSpace(email))
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return "", nil, ErrInvalidCredentials
		}
		logger.LegacyPrintf("service.auth", "[Auth] Database error during login: %v", err)
		return "", nil, ErrServiceUnavailable
	}
	if !user.CheckPassword(password) {
		return "", nil, ErrInvalidCredentials
	}
	if !user.IsActive() {
		return "", nil, ErrUserNotActive
	}
	token, err := s.GenerateToken(ctx, user)
	if err != nil {
		return "", nil, fmt.Errorf("generate token: %w", err)
	}
	return token, user, nil
}

// RecordSuccessfulLogin updates activity only after the complete login flow,
// including any second-factor challenge, has succeeded.
func (s *AuthService) RecordSuccessfulLogin(ctx context.Context, userID int64) {
	if s == nil || s.userRepo == nil || userID <= 0 {
		return
	}
	now := time.Now().UTC()
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to load user for login activity: user_id=%d err=%v", userID, err)
		return
	}
	user.LastLoginAt = &now
	user.LastActiveAt = &now
	if err := s.userRepo.Update(ctx, user, UserUpdateFields{LastLoginAt: true, LastActiveAt: true}); err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to update login activity: user_id=%d err=%v", userID, err)
	}
}

// ValidateToken verifies a signed administrator access token.
func (s *AuthService) ValidateToken(tokenString string) (*JWTClaims, error) {
	if len(tokenString) > maxTokenLength {
		return nil, ErrTokenTooLarge
	}
	if s == nil || s.cfg == nil {
		return nil, ErrInvalidToken
	}

	parser := jwt.NewParser(jwt.WithValidMethods([]string{
		jwt.SigningMethodHS256.Name,
		jwt.SigningMethodHS384.Name,
		jwt.SigningMethodHS512.Name,
	}))
	token, err := parser.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.cfg.JWT.Secret), nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			if token != nil {
				if claims, ok := token.Claims.(*JWTClaims); ok {
					return claims, ErrTokenExpired
				}
			}
			return nil, ErrTokenExpired
		}
		return nil, ErrInvalidToken
	}
	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}
	return claims, nil
}

func (s *AuthService) GenerateToken(ctx context.Context, user *User) (string, error) {
	sessionID, err := randomHexString(8)
	if err != nil {
		return "", fmt.Errorf("generate session id: %w", err)
	}
	return s.generateAccessToken(user, sessionID, sessionBindingHashFromContext(ctx))
}

func (s *AuthService) generateAccessToken(user *User, sessionID, bindingHash string) (string, error) {
	if s == nil || s.cfg == nil || user == nil {
		return "", ErrInvalidToken
	}
	now := time.Now()
	expiresAt := now.Add(time.Duration(s.cfg.JWT.ExpireHour) * time.Hour)
	if s.cfg.JWT.AccessTokenExpireMinutes > 0 {
		expiresAt = now.Add(time.Duration(s.cfg.JWT.AccessTokenExpireMinutes) * time.Minute)
	}
	claims := &JWTClaims{
		UserID:       user.ID,
		Email:        user.Email,
		Role:         user.Role,
		TokenVersion: resolvedTokenVersion(user),
		SessionID:    sessionID,
		BindingHash:  bindingHash,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}
	tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return "", fmt.Errorf("sign token: %w", err)
	}
	return tokenString, nil
}

func (s *AuthService) GetAccessTokenExpiresIn() int {
	if s == nil || s.cfg == nil {
		return 0
	}
	if s.cfg.JWT.AccessTokenExpireMinutes > 0 {
		return s.cfg.JWT.AccessTokenExpireMinutes * 60
	}
	return s.cfg.JWT.ExpireHour * 3600
}

// TokenPair contains the short-lived access token and rotating refresh token.
type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

type TokenPairWithUser struct {
	TokenPair
	UserRole string
}

func (s *AuthService) GenerateTokenPair(ctx context.Context, user *User, familyID string) (*TokenPair, error) {
	if s.refreshTokenCache == nil {
		return nil, errors.New("refresh token cache not configured")
	}
	if familyID == "" {
		var err error
		familyID, err = randomHexString(16)
		if err != nil {
			return nil, fmt.Errorf("generate family id: %w", err)
		}
	}
	accessToken, err := s.generateAccessToken(user, familyID, sessionBindingHashFromContext(ctx))
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}
	refreshToken, err := s.generateRefreshToken(ctx, user, familyID)
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}
	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    s.GetAccessTokenExpiresIn(),
	}, nil
}

func (s *AuthService) generateRefreshToken(ctx context.Context, user *User, familyID string) (string, error) {
	if user == nil {
		return "", ErrRefreshTokenInvalid
	}
	randomToken, err := randomHexString(32)
	if err != nil {
		return "", fmt.Errorf("generate random bytes: %w", err)
	}
	rawToken := refreshTokenPrefix + randomToken
	tokenHash := hashToken(rawToken)
	now := time.Now()
	ttl := s.refreshTokenTTL()
	data := &RefreshTokenData{
		UserID:       user.ID,
		TokenVersion: resolvedTokenVersion(user),
		FamilyID:     familyID,
		BindingHash:  sessionBindingHashFromContext(ctx),
		CreatedAt:    now,
		ExpiresAt:    now.Add(ttl),
	}
	if err := s.refreshTokenCache.StoreRefreshToken(ctx, tokenHash, data, ttl); err != nil {
		return "", fmt.Errorf("store refresh token: %w", err)
	}
	if err := s.refreshTokenCache.AddToUserTokenSet(ctx, user.ID, tokenHash, ttl); err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to add token to user set: %v", err)
	}
	if err := s.refreshTokenCache.AddToFamilyTokenSet(ctx, familyID, tokenHash, ttl); err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to add token to family set: %v", err)
	}
	return rawToken, nil
}

func (s *AuthService) refreshTokenTTL() time.Duration {
	days := MinimumRefreshTokenSessionDays
	if s != nil && s.cfg != nil && s.cfg.JWT.RefreshTokenExpireDays > days {
		days = s.cfg.JWT.RefreshTokenExpireDays
	}
	return time.Duration(days) * 24 * time.Hour
}

func (s *AuthService) RefreshTokenPair(ctx context.Context, refreshToken string) (*TokenPairWithUser, error) {
	if s.refreshTokenCache == nil || !strings.HasPrefix(refreshToken, refreshTokenPrefix) {
		return nil, ErrRefreshTokenInvalid
	}
	tokenHash := hashToken(refreshToken)
	data, err := s.refreshTokenCache.GetRefreshToken(ctx, tokenHash)
	if err != nil {
		if !errors.Is(err, ErrRefreshTokenNotFound) {
			logger.LegacyPrintf("service.auth", "[Auth] Error getting refresh token: %v", err)
			return nil, ErrServiceUnavailable
		}
		return nil, ErrRefreshTokenInvalid
	}
	if data == nil {
		return nil, ErrRefreshTokenInvalid
	}
	if time.Now().After(data.ExpiresAt) {
		_ = s.refreshTokenCache.DeleteRefreshToken(ctx, tokenHash)
		return nil, ErrRefreshTokenExpired
	}
	user, err := s.userRepo.GetByID(ctx, data.UserID)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			_ = s.refreshTokenCache.DeleteTokenFamily(ctx, data.FamilyID)
			return nil, ErrRefreshTokenInvalid
		}
		return nil, ErrServiceUnavailable
	}
	if !user.IsActive() {
		_ = s.refreshTokenCache.DeleteTokenFamily(ctx, data.FamilyID)
		return nil, ErrUserNotActive
	}
	if data.TokenVersion != resolvedTokenVersion(user) {
		_ = s.refreshTokenCache.DeleteTokenFamily(ctx, data.FamilyID)
		return nil, ErrTokenRevoked
	}
	if s.settingService != nil && s.settingService.IsSessionBindingEnabled(ctx) && data.BindingHash != "" {
		if current := sessionBindingHashFromContext(ctx); current != "" && current != data.BindingHash {
			_ = s.refreshTokenCache.DeleteTokenFamily(ctx, data.FamilyID)
			return nil, ErrSessionBindingMismatch
		}
	}
	if err := s.refreshTokenCache.DeleteRefreshToken(ctx, tokenHash); err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to delete rotated refresh token: %v", err)
	}
	pair, err := s.GenerateTokenPair(ctx, user, data.FamilyID)
	if err != nil {
		return nil, err
	}
	return &TokenPairWithUser{TokenPair: *pair, UserRole: user.Role}, nil
}

func (s *AuthService) RevokeRefreshToken(ctx context.Context, refreshToken string) error {
	if s.refreshTokenCache == nil {
		return nil
	}
	if !strings.HasPrefix(refreshToken, refreshTokenPrefix) {
		return ErrRefreshTokenInvalid
	}
	return s.refreshTokenCache.DeleteRefreshToken(ctx, hashToken(refreshToken))
}

func (s *AuthService) RevokeSessionFamily(ctx context.Context, familyID string) error {
	if s.refreshTokenCache == nil || familyID == "" {
		return nil
	}
	return s.refreshTokenCache.DeleteTokenFamily(ctx, familyID)
}

func (s *AuthService) RevokeAllUserSessions(ctx context.Context, userID int64) error {
	if s.refreshTokenCache == nil {
		return nil
	}
	return s.refreshTokenCache.DeleteUserRefreshTokens(ctx, userID)
}

func (s *AuthService) RevokeAllUserTokens(ctx context.Context, userID int64) error {
	if _, err := s.userRepo.GetByID(ctx, userID); err != nil {
		return fmt.Errorf("get user: %w", err)
	}
	if err := s.RevokeAllUserSessions(ctx, userID); err != nil {
		logger.LegacyPrintf("service.auth", "[Auth] Failed to revoke refresh sessions for user %d: %v", userID, err)
	}
	return nil
}

func randomHexString(byteLength int) (string, error) {
	if byteLength <= 0 {
		byteLength = 16
	}
	buf := make([]byte, byteLength)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

func resolvedTokenVersion(user *User) int64 {
	if user == nil {
		return 0
	}
	if user.TokenVersionResolved {
		return user.TokenVersion
	}
	material := strings.ToLower(strings.TrimSpace(user.Email)) + "\n" + user.PasswordHash
	sum := sha256.Sum256([]byte(material))
	fingerprint := int64(binary.BigEndian.Uint64(sum[:8]) & 0x7fffffffffffffff)
	return user.TokenVersion ^ fingerprint
}

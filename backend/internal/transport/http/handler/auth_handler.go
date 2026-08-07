package handler

import (
	"errors"
	"io"
	"log/slog"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
)

// AuthHandler exposes the local administrator session surface.
type AuthHandler struct {
	cfg         *config.Config
	authService *service.AuthService
	userService *service.UserService
	settingSvc  *service.SettingService
	totpService *service.TotpService
}

func NewAuthHandler(
	cfg *config.Config,
	authService *service.AuthService,
	userService *service.UserService,
	settingService *service.SettingService,
	totpService *service.TotpService,
) *AuthHandler {
	return &AuthHandler{
		cfg:         cfg,
		authService: authService,
		userService: userService,
		settingSvc:  settingService,
		totpService: totpService,
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token,omitempty"`
	ExpiresIn    int       `json:"expires_in,omitempty"`
	TokenType    string    `json:"token_type"`
	User         *dto.User `json:"user"`
}

func ensureAdminLoginUser(user *service.User) error {
	if user == nil {
		return infraerrors.Unauthorized("INVALID_USER", "user not found")
	}
	if !user.IsActive() {
		return service.ErrUserNotActive
	}
	if !user.IsAdmin() {
		return infraerrors.Forbidden("ADMIN_ONLY", "Only the local administrator can sign in.")
	}
	return nil
}

func (h *AuthHandler) respondWithTokenPair(c *gin.Context, user *service.User) {
	if err := ensureAdminLoginUser(user); err != nil {
		response.ErrorFrom(c, err)
		return
	}

	tokenPair, err := h.authService.GenerateTokenPair(c.Request.Context(), user, "")
	if err != nil {
		slog.Error("failed to generate token pair", "error", err, "user_id", user.ID)
		token, tokenErr := h.authService.GenerateToken(c.Request.Context(), user)
		if tokenErr != nil {
			response.InternalError(c, "Failed to generate token")
			return
		}
		response.Success(c, AuthResponse{
			AccessToken: token,
			TokenType:   "Bearer",
			User:        dto.UserFromService(user),
		})
		return
	}

	setRefreshTokenCookie(c, tokenPair.RefreshToken, h.refreshTokenCookieTTL())
	response.Success(c, AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresIn:    tokenPair.ExpiresIn,
		TokenType:    "Bearer",
		User:         dto.UserFromService(user),
	})
}

func (h *AuthHandler) refreshTokenCookieTTL() time.Duration {
	days := service.MinimumRefreshTokenSessionDays
	if h != nil && h.cfg != nil && h.cfg.JWT.RefreshTokenExpireDays > days {
		days = h.cfg.JWT.RefreshTokenExpireDays
	}
	return time.Duration(days) * 24 * time.Hour
}

// Login authenticates the local administrator.
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	_, user, err := h.authService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if err := ensureAdminLoginUser(user); err != nil {
		response.ErrorFrom(c, err)
		return
	}

	if h.totpService != nil && user.TotpEnabled {
		tempToken, err := h.totpService.CreateLoginSession(c.Request.Context(), user.ID, user.Email)
		if err != nil {
			response.InternalError(c, "Failed to create 2FA session")
			return
		}
		response.Success(c, TotpLoginResponse{
			Requires2FA:     true,
			TempToken:       tempToken,
			UserEmailMasked: service.MaskEmail(user.Email),
		})
		return
	}

	h.authService.RecordSuccessfulLogin(c.Request.Context(), user.ID)
	h.respondWithTokenPair(c, user)
}

type TotpLoginResponse struct {
	Requires2FA     bool   `json:"requires_2fa"`
	TempToken       string `json:"temp_token,omitempty"`
	UserEmailMasked string `json:"user_email_masked,omitempty"`
}

type Login2FARequest struct {
	TempToken string `json:"temp_token" binding:"required"`
	TotpCode  string `json:"totp_code" binding:"required,len=6"`
}

// Login2FA completes a local administrator login challenge.
func (h *AuthHandler) Login2FA(c *gin.Context) {
	var req Login2FARequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}
	if h.totpService == nil {
		response.InternalError(c, "2FA service is unavailable")
		return
	}

	session, err := h.totpService.GetLoginSession(c.Request.Context(), req.TempToken)
	if err != nil || session == nil {
		response.BadRequest(c, "Invalid or expired 2FA session")
		return
	}
	if err := h.totpService.VerifyCode(c.Request.Context(), session.UserID, req.TotpCode); err != nil {
		response.ErrorFrom(c, err)
		return
	}

	user, err := h.userService.GetByID(c.Request.Context(), session.UserID)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if err := ensureAdminLoginUser(user); err != nil {
		response.ErrorFrom(c, err)
		return
	}

	_ = h.totpService.DeleteLoginSession(c.Request.Context(), req.TempToken)
	h.authService.RecordSuccessfulLogin(c.Request.Context(), user.ID)
	h.respondWithTokenPair(c, user)
}

// GetCurrentUser returns the authenticated administrator.
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	subject, ok := servermiddleware.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	user, err := h.userService.GetByID(c.Request.Context(), subject.UserID)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if err := ensureAdminLoginUser(user); err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, dto.UserFromService(user))
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
}

// RefreshToken rotates the local administrator session.
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}
	refreshToken := strings.TrimSpace(req.RefreshToken)
	if refreshToken == "" {
		refreshToken = readRefreshTokenCookie(c)
	}
	if refreshToken == "" {
		response.BadRequest(c, "Refresh token is required")
		return
	}

	result, err := h.authService.RefreshTokenPair(c.Request.Context(), refreshToken)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if result.UserRole != service.RoleAdmin {
		_ = h.authService.RevokeRefreshToken(c.Request.Context(), result.RefreshToken)
		clearRefreshTokenCookie(c)
		response.ErrorFrom(c, infraerrors.Forbidden("ADMIN_ONLY", "Only the local administrator can refresh a session."))
		return
	}

	setRefreshTokenCookie(c, result.RefreshToken, h.refreshTokenCookieTTL())
	response.Success(c, RefreshTokenResponse{
		AccessToken:  result.AccessToken,
		RefreshToken: result.RefreshToken,
		ExpiresIn:    result.ExpiresIn,
		TokenType:    "Bearer",
	})
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token,omitempty"`
}

// Logout revokes the current refresh credential and clears its cookie.
func (h *AuthHandler) Logout(c *gin.Context) {
	var req LogoutRequest
	_ = c.ShouldBindJSON(&req)
	refreshToken := strings.TrimSpace(req.RefreshToken)
	if refreshToken == "" {
		refreshToken = readRefreshTokenCookie(c)
	}
	if refreshToken != "" {
		if err := h.authService.RevokeRefreshToken(c.Request.Context(), refreshToken); err != nil {
			slog.Debug("failed to revoke refresh token", "error", err)
		}
	}
	clearRefreshTokenCookie(c)
	response.Success(c, gin.H{"message": "Logged out successfully"})
}

// RevokeAllSessions invalidates every administrator refresh session.
func (h *AuthHandler) RevokeAllSessions(c *gin.Context) {
	subject, ok := servermiddleware.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}
	if err := h.authService.RevokeAllUserTokens(c.Request.Context(), subject.UserID); err != nil {
		slog.Error("failed to revoke all sessions", "user_id", subject.UserID, "error", err)
		response.InternalError(c, "Failed to revoke sessions")
		return
	}
	response.Success(c, gin.H{"message": "All sessions have been revoked. Please log in again."})
}

package handler

import (
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
)

// UserHandler manages the local administrator profile.
type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type UpdateProfileRequest struct {
	Username  *string `json:"username"`
	AvatarURL *string `json:"avatar_url"`
}

type adminProfileResponse struct {
	dto.User
	AvatarURL string `json:"avatar_url,omitempty"`
}

func newAdminProfileResponse(user *service.User) *adminProfileResponse {
	if user == nil {
		return nil
	}
	return &adminProfileResponse{
		User:      *dto.UserFromService(user),
		AvatarURL: user.AvatarURL,
	}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	subject, ok := servermiddleware.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}
	user, err := h.userService.GetProfile(c.Request.Context(), subject.UserID)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	response.Success(c, newAdminProfileResponse(user))
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	subject, ok := servermiddleware.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}
	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}
	if err := h.userService.ChangePassword(c.Request.Context(), subject.UserID, service.ChangePasswordRequest{
		CurrentPassword: req.OldPassword,
		NewPassword:     req.NewPassword,
	}); err != nil {
		response.ErrorFrom(c, err)
		return
	}
	response.Success(c, gin.H{"message": "Password changed successfully"})
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	subject, ok := servermiddleware.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}
	user, err := h.userService.UpdateProfile(c.Request.Context(), subject.UserID, service.UpdateProfileRequest{
		Username:  req.Username,
		AvatarURL: req.AvatarURL,
	})
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	response.Success(c, newAdminProfileResponse(user))
}

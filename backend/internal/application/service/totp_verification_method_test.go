//go:build unit

package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
)

// totpVMUserRepoStub only implements the administrator-password paths exercised here.
type totpVMUserRepoStub struct {
	UserRepository
	user          *User
	totpDisabled  bool
	disableCalled bool
}

func (s *totpVMUserRepoStub) GetByID(ctx context.Context, id int64) (*User, error) {
	if s.user == nil {
		return nil, errors.New("user not found")
	}
	return s.user, nil
}

func (s *totpVMUserRepoStub) DisableTotp(ctx context.Context, userID int64) error {
	s.disableCalled = true
	s.totpDisabled = true
	return nil
}

func newTotpVMService(t *testing.T, user *User) (*TotpService, *totpVMUserRepoStub) {
	t.Helper()
	userRepo := &totpVMUserRepoStub{user: user}
	return NewTotpService(userRepo, nil, nil, nil), userRepo
}

func TestTotpDisableUsesLocalAdminPassword(t *testing.T) {
	admin := &User{ID: 1, Email: "admin@example.com", Role: RoleAdmin, TotpEnabled: true}
	require.NoError(t, admin.SetPassword("correct-password"))
	svc, userRepo := newTotpVMService(t, admin)

	err := svc.Disable(context.Background(), admin.ID, "")
	require.ErrorIs(t, err, ErrPasswordRequired)

	err = svc.Disable(context.Background(), admin.ID, "wrong-password")
	require.ErrorIs(t, err, ErrPasswordIncorrect)

	err = svc.Disable(context.Background(), admin.ID, "correct-password")
	require.NoError(t, err)
	require.True(t, userRepo.disableCalled)
}

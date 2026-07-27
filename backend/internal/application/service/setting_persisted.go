package service

import (
	"context"
	"fmt"
)

// getPersistedSystemSettings reads only the stored configuration. Unlike
// GetAllSettings, it does not overlay scheduler runtime state on persisted
// scheduler targets, so it is safe to use while applying a partial update.
func (s *SettingService) getPersistedSystemSettings(ctx context.Context) (*SystemSettings, error) {
	settings, err := s.settingRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all settings: %w", err)
	}
	return s.parseSettings(settings), nil
}

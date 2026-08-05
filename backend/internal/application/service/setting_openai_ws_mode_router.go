package service

import (
	"context"
	"errors"
	"fmt"
	"time"
)

const openAIWSModeRouterV2RefreshInterval = 30 * time.Second

func (s *SettingService) defaultOpenAIWSModeRouterV2Enabled() bool {
	return s != nil && s.cfg != nil && s.cfg.Gateway.OpenAIWS.ModeRouterV2Enabled
}

// LoadOpenAIWSModeRouterV2Setting loads the persisted runtime override. Older
// installations without the setting retain their YAML/environment behavior.
func (s *SettingService) LoadOpenAIWSModeRouterV2Setting(ctx context.Context) error {
	if s == nil || s.settingRepo == nil {
		return nil
	}

	value, err := s.settingRepo.GetValue(ctx, SettingKeyOpenAIWSModeRouterV2Enabled)
	if err != nil {
		if errors.Is(err, ErrSettingNotFound) {
			s.openAIWSModeRouterV2Enabled.Store(s.defaultOpenAIWSModeRouterV2Enabled())
			s.openAIWSModeRouterV2Loaded.Store(time.Now().UnixNano())
			return nil
		}
		return fmt.Errorf("get OpenAI WS mode router v2 setting: %w", err)
	}

	s.openAIWSModeRouterV2Enabled.Store(value == "true")
	s.openAIWSModeRouterV2Loaded.Store(time.Now().UnixNano())
	return nil
}

// IsOpenAIWSModeRouterV2Enabled returns the cached runtime switch. The bounded
// refresh keeps independently running instances aligned without a DB read on
// every gateway request.
func (s *SettingService) IsOpenAIWSModeRouterV2Enabled(ctx context.Context) bool {
	if s == nil {
		return false
	}
	loadedAt := s.openAIWSModeRouterV2Loaded.Load()
	if loadedAt == 0 || time.Since(time.Unix(0, loadedAt)) >= openAIWSModeRouterV2RefreshInterval {
		_, _, _ = s.openAIWSModeRouterV2SF.Do("refresh", func() (any, error) {
			err := s.LoadOpenAIWSModeRouterV2Setting(ctx)
			if err != nil {
				s.openAIWSModeRouterV2Loaded.Store(time.Now().UnixNano())
			}
			return nil, err
		})
	}
	return s.openAIWSModeRouterV2Enabled.Load()
}

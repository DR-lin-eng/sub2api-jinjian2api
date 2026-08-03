package service

import (
	"context"
	"errors"
	"log/slog"
	"strings"
	"time"
)

const (
	supportChatCacheTTL   = 60 * time.Second
	supportChatErrorTTL   = 5 * time.Second
	supportChatDBTimeout  = 5 * time.Second
	supportChatRefreshKey = "support_chat_enabled"
)

type cachedSupportChatEnabled struct {
	value     bool
	expiresAt int64
}

// IsSupportChatEnabled returns the cached opt-in switch. Missing settings and
// storage failures are deliberately disabled so an upgrade cannot expose a
// new chat surface while its control plane is unavailable.
func (s *SettingService) IsSupportChatEnabled(ctx context.Context) bool {
	if s == nil || s.settingRepo == nil {
		return false
	}
	if cached, ok := s.supportChatCache.Load().(*cachedSupportChatEnabled); ok && cached != nil {
		if time.Now().UnixNano() < cached.expiresAt {
			return cached.value
		}
	}

	if ctx == nil {
		ctx = context.Background()
	}
	result, _, _ := s.supportChatSF.Do(supportChatRefreshKey, func() (any, error) {
		s.supportChatCacheMu.Lock()
		defer s.supportChatCacheMu.Unlock()

		if cached, ok := s.supportChatCache.Load().(*cachedSupportChatEnabled); ok && cached != nil {
			if time.Now().UnixNano() < cached.expiresAt {
				return cached.value, nil
			}
		}

		dbCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), supportChatDBTimeout)
		defer cancel()
		value, err := s.settingRepo.GetValue(dbCtx, SettingKeySupportChatEnabled)
		if err != nil {
			ttl := supportChatErrorTTL
			if errors.Is(err, ErrSettingNotFound) {
				ttl = supportChatCacheTTL
			} else {
				slog.Warn("failed to read support chat feature setting", "error", err)
			}
			s.supportChatCache.Store(&cachedSupportChatEnabled{
				value:     false,
				expiresAt: time.Now().Add(ttl).UnixNano(),
			})
			return false, nil
		}

		enabled := strings.EqualFold(strings.TrimSpace(value), "true")
		s.supportChatCache.Store(&cachedSupportChatEnabled{
			value:     enabled,
			expiresAt: time.Now().Add(supportChatCacheTTL).UnixNano(),
		})
		return enabled, nil
	})
	if enabled, ok := result.(bool); ok {
		return enabled
	}
	return false
}

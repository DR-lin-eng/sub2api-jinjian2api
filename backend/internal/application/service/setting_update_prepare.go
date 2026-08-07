package service

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/ip"
)

func (s *SettingService) prepareSystemSettingsUpdate(ctx context.Context, settings *SystemSettings) (string, error) {
	// Preserve compatibility with older internal callers that construct a
	// zero-value SystemSettings while updating an unrelated setting.
	if settings.SchedulerV2CandidateLimit == 0 && settings.SchedulerV2ScanLimit == 0 {
		settings.SchedulerV2CandidateLimit = DefaultSchedulerCandidateFetchLimit
		settings.SchedulerV2ScanLimit = DefaultSchedulerCandidateScanLimit
	}
	if err := ValidateSchedulerV2Limits(settings.SchedulerV2CandidateLimit, settings.SchedulerV2ScanLimit); err != nil {
		return "", infraerrors.BadRequest("INVALID_SCHEDULER_V2_LIMITS", err.Error())
	}
	requestPrioritySettings := normalizeRequestPriorityAdmissionSettings(RequestPriorityAdmissionSettings{
		Enabled:                 settings.RequestPriorityAdmissionEnabled,
		PendingLimitPerInstance: settings.RequestPriorityPendingLimitPerInstance,
		PendingMiBPerInstance:   settings.RequestPriorityPendingMiBPerInstance,
	})
	settings.RequestPriorityPendingLimitPerInstance = requestPrioritySettings.PendingLimitPerInstance
	settings.RequestPriorityPendingMiBPerInstance = requestPrioritySettings.PendingMiBPerInstance
	if err := s.normalizeOpenAIAdvancedSchedulerOverrides(settings); err != nil {
		return "", err
	}
	if strings.TrimSpace(settings.ClientIPResolutionMode) == "" {
		if s.clientIPResolver != nil {
			settings.ClientIPResolutionMode, settings.ClientIPTrustedProxies = s.clientIPResolver.CurrentConfiguration()
		} else {
			settings.ClientIPResolutionMode = ip.ResolutionModeAutoCompat
		}
	}
	settings.ClientIPResolutionMode = strings.TrimSpace(settings.ClientIPResolutionMode)
	if err := ip.ValidateResolutionMode(settings.ClientIPResolutionMode); err != nil {
		return "", infraerrors.BadRequest("INVALID_CLIENT_IP_RESOLUTION_MODE", err.Error())
	}
	if settings.ClientIPTrustedProxies == nil {
		settings.ClientIPTrustedProxies = make([]string, 0)
	}
	normalizedClientIPTrustedProxies, err := ip.NormalizeTrustedProxies(settings.ClientIPTrustedProxies)
	if err != nil {
		return "", infraerrors.BadRequest("INVALID_CLIENT_IP_TRUSTED_PROXIES", err.Error())
	}
	settings.ClientIPTrustedProxies = normalizedClientIPTrustedProxies
	clientIPTrustedProxiesJSON, err := json.Marshal(settings.ClientIPTrustedProxies)
	if err != nil {
		return "", fmt.Errorf("marshal client IP trusted proxies: %w", err)
	}
	settings.APIKeyACLTrustForwardedIP = settings.ClientIPResolutionMode != ip.ResolutionModeDirect
	return string(clientIPTrustedProxiesJSON), nil
}

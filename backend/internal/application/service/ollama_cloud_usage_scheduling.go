package service

import "time"

func defaultOllamaCloudUsageSettings() *OllamaCloudUsageSettings {
	return &OllamaCloudUsageSettings{
		Enabled:         false,
		IntervalMinutes: ollamaCloudUsageDefaultIntervalMinutes,
		DebounceMinutes: ollamaCloudUsageDefaultDebounceMinutes,
	}
}

func normalizeOllamaCloudUsageSettings(settings *OllamaCloudUsageSettings) {
	if settings.IntervalMinutes < ollamaCloudUsageMinIntervalMinutes {
		settings.IntervalMinutes = ollamaCloudUsageMinIntervalMinutes
	}
	if settings.IntervalMinutes > ollamaCloudUsageMaxIntervalMinutes {
		settings.IntervalMinutes = ollamaCloudUsageMaxIntervalMinutes
	}
	if settings.DebounceMinutes <= 0 {
		settings.DebounceMinutes = ollamaCloudUsageDefaultDebounceMinutes
	}
	if settings.DebounceMinutes < ollamaCloudUsageMinDebounceMinutes {
		settings.DebounceMinutes = ollamaCloudUsageMinDebounceMinutes
	}
	if settings.DebounceMinutes > ollamaCloudUsageMaxDebounceMinutes {
		settings.DebounceMinutes = ollamaCloudUsageMaxDebounceMinutes
	}
}

func ollamaCloudUsageDurations(settings *OllamaCloudUsageSettings) (debounce, maxWait time.Duration) {
	normalized := defaultOllamaCloudUsageSettings()
	if settings != nil {
		*normalized = *settings
	}
	normalizeOllamaCloudUsageSettings(normalized)
	return time.Duration(normalized.DebounceMinutes) * time.Minute,
		time.Duration(normalized.IntervalMinutes) * time.Minute
}

// ollamaCloudUsageIsAutoRefreshDue decides whether a configured auto-refresh
// group should fetch now. groupLastUsedAt must be MAX(last_used_at) across the
// exact api_key group so shared multi-platform accounts do not miss activity.
//
// Success: a request must be newer than fetched_at; dueAt = min(lastUsed+debounce, fetchedAt+maxWait).
// Failure: a request must be newer than last_attempt_at; activity due uses the same min formula,
// then dueAt = max(activityDue, next_refresh_at) so Retry-After / exponential backoff win.
// Missing or invalid snapshots fail open to a first fetch.
func ollamaCloudUsageIsAutoRefreshDue(
	snapshot *OllamaCloudUsageSnapshot,
	groupLastUsedAt *time.Time,
	now time.Time,
	debounce, maxWait time.Duration,
) bool {
	dueAt, ok := ollamaCloudUsageAutoRefreshDueAt(snapshot, groupLastUsedAt, debounce, maxWait)
	if !ok {
		return false
	}
	return !now.Before(dueAt)
}

func ollamaCloudUsageAutoRefreshDueAt(
	snapshot *OllamaCloudUsageSnapshot,
	groupLastUsedAt *time.Time,
	debounce, maxWait time.Duration,
) (time.Time, bool) {
	if debounce <= 0 {
		debounce = time.Duration(ollamaCloudUsageDefaultDebounceMinutes) * time.Minute
	}
	if maxWait <= 0 {
		maxWait = time.Duration(ollamaCloudUsageDefaultIntervalMinutes) * time.Minute
	}
	if snapshot == nil {
		return time.Time{}, true
	}
	switch snapshot.Status {
	case OllamaCloudUsageStatusOK:
		if snapshot.FetchedAt == nil || snapshot.FetchedAt.IsZero() {
			return time.Time{}, true
		}
		fetchedAt := snapshot.FetchedAt.UTC()
		if groupLastUsedAt == nil || !groupLastUsedAt.After(fetchedAt) {
			return time.Time{}, false
		}
		lastUsed := groupLastUsedAt.UTC()
		dueAt := minTime(lastUsed.Add(debounce), fetchedAt.Add(maxWait))
		// Keep the pre-existing hard floor between successful fetches. The success
		// path no longer consults next_refresh_at, which is where
		// nextOllamaCloudUsageDelay used to apply ollamaCloudUsageMinIntervalMinutes;
		// without this, request traffic spaced slightly wider than the debounce
		// drives the group's outbound rate far above the previous minimum.
		if floor := fetchedAt.Add(OllamaCloudUsageMinFetchInterval); dueAt.Before(floor) {
			return floor, true
		}
		return dueAt, true
	case OllamaCloudUsageStatusFailed, OllamaCloudUsageStatusUnauthorized:
		if snapshot.LastAttemptAt.IsZero() {
			return time.Time{}, true
		}
		lastAttempt := snapshot.LastAttemptAt.UTC()
		if groupLastUsedAt == nil || !groupLastUsedAt.After(lastAttempt) {
			return time.Time{}, false
		}
		lastUsed := groupLastUsedAt.UTC()
		activityDue := minTime(lastUsed.Add(debounce), lastAttempt.Add(maxWait))
		if !snapshot.NextRefreshAt.IsZero() && snapshot.NextRefreshAt.UTC().After(activityDue) {
			return snapshot.NextRefreshAt.UTC(), true
		}
		return activityDue, true
	default:
		return time.Time{}, true
	}
}

// maxOllamaCloudUsageGroupLastUsed returns the newest last_used_at among group members.
func maxOllamaCloudUsageGroupLastUsed(accounts []Account) *time.Time {
	var latest *time.Time
	for i := range accounts {
		candidate := accounts[i].LastUsedAt
		if candidate == nil || candidate.IsZero() {
			continue
		}
		if latest == nil || candidate.After(*latest) {
			ts := candidate.UTC()
			latest = &ts
		}
	}
	return latest
}

// scheduleOllamaCloudUsageActivity records that an Ollama Cloud API-key account
// actually attempted an upstream model request (including 429/5xx/transport errors).
// Local auth/validation failures must not call this. DeferredService dedupes writes.
func scheduleOllamaCloudUsageActivity(deferred *DeferredService, account *Account) {
	if deferred == nil || account == nil || !IsOllamaCloudUsageAccount(account) {
		return
	}
	deferred.ScheduleLastUsedUpdate(account.ID)
}

package service

import (
	"context"
	"log/slog"
	"strings"
	"sync"
	"time"
)

const (
	// Official Codex releases change on a day-scale. Six-hour polling keeps the
	// identity current without putting GitHub on a request path.
	openAICodexVersionSyncInterval = 6 * time.Hour
	openAICodexVersionSyncTimeout  = 30 * time.Second
	openAICodexVersionSyncRepo     = "openai/codex"
	// The repository has dense prerelease runs. Thirty entries safely spans the
	// observed gaps between stable rust-v releases while bounding response size.
	openAICodexVersionSyncPerPage = 30
	openAICodexVersionTagPrefix   = "rust-v"
)

// OpenAICodexVersionSyncService keeps the runtime Codex identity aligned with
// the latest official stable release. The synchronized value is separate from
// the administrator override, so an explicit pinned version always wins.
type OpenAICodexVersionSyncService struct {
	settingRepo    SettingRepository
	settingService *SettingService
	githubClient   GitHubReleaseClient
	interval       time.Duration
	stopCh         chan struct{}
	stopOnce       sync.Once
	wg             sync.WaitGroup
}

func NewOpenAICodexVersionSyncService(
	settingRepo SettingRepository,
	settingService *SettingService,
	githubClient GitHubReleaseClient,
	interval time.Duration,
) *OpenAICodexVersionSyncService {
	return &OpenAICodexVersionSyncService{
		settingRepo:    settingRepo,
		settingService: settingService,
		githubClient:   githubClient,
		interval:       interval,
		stopCh:         make(chan struct{}),
	}
}

func (s *OpenAICodexVersionSyncService) Start() {
	if s == nil || s.settingRepo == nil || s.githubClient == nil || s.interval <= 0 {
		return
	}
	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		ticker := time.NewTicker(s.interval)
		defer ticker.Stop()

		s.runInitial()
		for {
			select {
			case <-ticker.C:
				s.runOnce()
			case <-s.stopCh:
				return
			}
		}
	}()
}

func (s *OpenAICodexVersionSyncService) Stop() {
	if s == nil {
		return
	}
	s.stopOnce.Do(func() { close(s.stopCh) })
	s.wg.Wait()
}

// runInitial avoids a GitHub request storm during rolling or crash-loop
// restarts by using the synchronized setting row's update timestamp.
func (s *OpenAICodexVersionSyncService) runInitial() {
	if s.syncedWithinInterval() {
		return
	}
	s.runOnce()
}

func (s *OpenAICodexVersionSyncService) syncedWithinInterval() bool {
	if s == nil || s.settingRepo == nil || s.interval <= 0 {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), openAICodexVersionSyncTimeout)
	defer cancel()

	setting, err := s.settingRepo.Get(ctx, SettingKeyOpenAICodexClientVersionSynced)
	if err != nil || setting == nil || setting.UpdatedAt.IsZero() || NormalizeCodexClientVersion(setting.Value) == "" {
		return false
	}
	age := time.Since(setting.UpdatedAt)
	return age >= 0 && age < s.interval
}

func (s *OpenAICodexVersionSyncService) runOnce() {
	if s == nil || s.settingRepo == nil || s.githubClient == nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), openAICodexVersionSyncTimeout)
	defer cancel()

	if !s.autoSyncEnabled(ctx) {
		return
	}
	latest := s.fetchLatestStableVersion(ctx)
	if latest == "" {
		return
	}

	current := NormalizeCodexClientVersion(s.currentSyncedVersion(ctx))
	if current != "" && CompareVersions(latest, current) <= 0 {
		return
	}
	if err := s.settingRepo.Set(ctx, SettingKeyOpenAICodexClientVersionSynced, latest); err != nil {
		slog.Warn("openai_codex_version_sync_persist_failed", "version", latest, "error", err)
		return
	}
	if s.settingService != nil {
		s.settingService.InvalidateOpenAICodexClientVersionCache()
	}
	slog.Info("openai_codex_version_synced", "previous", current, "version", latest)
}

func (s *OpenAICodexVersionSyncService) fetchLatestStableVersion(ctx context.Context) string {
	release, err := s.githubClient.FetchLatestRelease(ctx, openAICodexVersionSyncRepo)
	if err != nil {
		slog.Warn("openai_codex_version_sync_latest_fetch_failed", "error", err)
	} else if version := latestCodexStableReleaseVersion([]*GitHubRelease{release}); version != "" {
		return version
	}

	releases, err := s.githubClient.FetchRecentReleases(ctx, openAICodexVersionSyncRepo, openAICodexVersionSyncPerPage)
	if err != nil {
		slog.Warn("openai_codex_version_sync_fetch_failed", "error", err)
		return ""
	}
	version := latestCodexStableReleaseVersion(releases)
	if version == "" {
		slog.Warn("openai_codex_version_sync_no_stable_release", "repo", openAICodexVersionSyncRepo)
	}
	return version
}

func (s *OpenAICodexVersionSyncService) autoSyncEnabled(ctx context.Context) bool {
	value, err := s.settingRepo.GetValue(ctx, SettingKeyOpenAICodexVersionAutoSyncEnabled)
	if err != nil || strings.TrimSpace(value) == "" {
		return true
	}
	return strings.TrimSpace(value) == "true"
}

func (s *OpenAICodexVersionSyncService) currentSyncedVersion(ctx context.Context) string {
	value, err := s.settingRepo.GetValue(ctx, SettingKeyOpenAICodexClientVersionSynced)
	if err != nil {
		return ""
	}
	return value
}

func latestCodexStableReleaseVersion(releases []*GitHubRelease) string {
	best := ""
	for _, release := range releases {
		if release == nil || release.Draft || release.Prerelease {
			continue
		}
		tag := strings.TrimSpace(release.TagName)
		if !strings.HasPrefix(tag, openAICodexVersionTagPrefix) {
			continue
		}
		version := NormalizeCodexClientVersion(strings.TrimPrefix(tag, openAICodexVersionTagPrefix))
		if version == "" || strings.Contains(version, "-") {
			continue
		}
		if best == "" || CompareVersions(version, best) > 0 {
			best = version
		}
	}
	return best
}

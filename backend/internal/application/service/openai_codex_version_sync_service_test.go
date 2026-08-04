//go:build unit

package service

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type codexVersionSettingRepo struct {
	mu       sync.Mutex
	settings map[string]*Setting
	setCalls int
}

func newCodexVersionSettingRepo() *codexVersionSettingRepo {
	return &codexVersionSettingRepo{settings: make(map[string]*Setting)}
}

func (r *codexVersionSettingRepo) Get(_ context.Context, key string) (*Setting, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	setting, ok := r.settings[key]
	if !ok {
		return nil, ErrSettingNotFound
	}
	copy := *setting
	return &copy, nil
}

func (r *codexVersionSettingRepo) GetValue(ctx context.Context, key string) (string, error) {
	setting, err := r.Get(ctx, key)
	if err != nil {
		if errors.Is(err, ErrSettingNotFound) {
			return "", nil
		}
		return "", err
	}
	return setting.Value, nil
}

func (r *codexVersionSettingRepo) Set(_ context.Context, key, value string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.setCalls++
	r.settings[key] = &Setting{Key: key, Value: value, UpdatedAt: time.Now()}
	return nil
}

func (r *codexVersionSettingRepo) GetMultiple(_ context.Context, keys []string) (map[string]string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	values := make(map[string]string, len(keys))
	for _, key := range keys {
		if setting := r.settings[key]; setting != nil {
			values[key] = setting.Value
		}
	}
	return values, nil
}

func (r *codexVersionSettingRepo) SetMultiple(ctx context.Context, settings map[string]string) error {
	for key, value := range settings {
		if err := r.Set(ctx, key, value); err != nil {
			return err
		}
	}
	return nil
}

func (r *codexVersionSettingRepo) GetAll(_ context.Context) (map[string]string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	values := make(map[string]string, len(r.settings))
	for key, setting := range r.settings {
		values[key] = setting.Value
	}
	return values, nil
}

func (r *codexVersionSettingRepo) Delete(_ context.Context, key string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.settings, key)
	return nil
}

type codexVersionGitHubClient struct {
	latest        *GitHubRelease
	latestErr     error
	recent        []*GitHubRelease
	recentErr     error
	latestCalls   int
	recentCalls   int
	recentPerPage int
}

func (c *codexVersionGitHubClient) FetchLatestRelease(_ context.Context, repo string) (*GitHubRelease, error) {
	c.latestCalls++
	if repo != openAICodexVersionSyncRepo {
		return nil, errors.New("unexpected repo")
	}
	return c.latest, c.latestErr
}

func (c *codexVersionGitHubClient) FetchRecentReleases(_ context.Context, repo string, perPage int) ([]*GitHubRelease, error) {
	c.recentCalls++
	c.recentPerPage = perPage
	if repo != openAICodexVersionSyncRepo {
		return nil, errors.New("unexpected repo")
	}
	return c.recent, c.recentErr
}

func (*codexVersionGitHubClient) DownloadFile(context.Context, string, string, int64) error {
	return errors.New("unexpected DownloadFile call")
}

func (*codexVersionGitHubClient) FetchReleaseFile(context.Context, string, int64) ([]byte, error) {
	return nil, errors.New("unexpected FetchReleaseFile call")
}

func TestLatestCodexStableReleaseVersion(t *testing.T) {
	releases := []*GitHubRelease{
		{TagName: "rust-v0.149.0-alpha.2"},
		{TagName: "rust-v0.147.0", Prerelease: true},
		{TagName: "rust-v0.148.0"},
		{TagName: "rust-v0.146.0"},
		{TagName: "rusty-v8-1.2.3"},
		{TagName: "rust-v0.200.0", Draft: true},
	}
	require.Equal(t, "0.148.0", latestCodexStableReleaseVersion(releases))
}

func TestOpenAICodexVersionSyncUsesLatestThenFallback(t *testing.T) {
	repo := newCodexVersionSettingRepo()
	settingService := NewSettingService(repo, nil)
	client := &codexVersionGitHubClient{latest: &GitHubRelease{TagName: "rust-v0.151.0"}}
	svc := NewOpenAICodexVersionSyncService(repo, settingService, client, time.Hour)

	svc.runOnce()
	require.Equal(t, "0.151.0", repo.settings[SettingKeyOpenAICodexClientVersionSynced].Value)
	require.Equal(t, 1, client.latestCalls)
	require.Zero(t, client.recentCalls)

	client.latest = &GitHubRelease{TagName: "rusty-v8-1.2.3"}
	client.recent = []*GitHubRelease{{TagName: "rust-v0.152.0"}}
	svc.runOnce()
	require.Equal(t, "0.152.0", repo.settings[SettingKeyOpenAICodexClientVersionSynced].Value)
	require.Equal(t, openAICodexVersionSyncPerPage, client.recentPerPage)
}

func TestOpenAICodexVersionSyncDoesNotDowngradeOrRunWhenDisabled(t *testing.T) {
	repo := newCodexVersionSettingRepo()
	repo.settings[SettingKeyOpenAICodexClientVersionSynced] = &Setting{Value: "0.200.0"}
	client := &codexVersionGitHubClient{latest: &GitHubRelease{TagName: "rust-v0.199.0"}}
	svc := NewOpenAICodexVersionSyncService(repo, NewSettingService(repo, nil), client, time.Hour)

	svc.runOnce()
	require.Equal(t, "0.200.0", repo.settings[SettingKeyOpenAICodexClientVersionSynced].Value)
	require.Zero(t, repo.setCalls)

	repo.settings[SettingKeyOpenAICodexVersionAutoSyncEnabled] = &Setting{Value: "false"}
	client.latest = &GitHubRelease{TagName: "rust-v0.201.0"}
	svc.runOnce()
	require.Equal(t, 1, client.latestCalls, "disabled sync must not call GitHub")
}

func TestOpenAICodexVersionSyncInitialDebounce(t *testing.T) {
	repo := newCodexVersionSettingRepo()
	repo.settings[SettingKeyOpenAICodexClientVersionSynced] = &Setting{
		Value:     "0.200.0",
		UpdatedAt: time.Now().Add(-time.Minute),
	}
	client := &codexVersionGitHubClient{latest: &GitHubRelease{TagName: "rust-v0.201.0"}}
	svc := NewOpenAICodexVersionSyncService(repo, NewSettingService(repo, nil), client, time.Hour)

	svc.runInitial()
	require.Zero(t, client.latestCalls)
}

func TestOpenAICodexClientVersionPrecedenceAndInvalidation(t *testing.T) {
	repo := newCodexVersionSettingRepo()
	repo.settings[SettingKeyOpenAICodexClientVersionSynced] = &Setting{Value: "0.180.0"}
	settingService := NewSettingService(repo, nil)

	require.Equal(t, "0.180.0", settingService.GetOpenAICodexClientVersion(context.Background()))
	repo.settings[SettingKeyOpenAICodexClientVersion] = &Setting{Value: "0.190.0"}
	require.Equal(t, "0.180.0", settingService.GetOpenAICodexClientVersion(context.Background()), "cached value should remain until invalidated")
	settingService.InvalidateOpenAICodexClientVersionCache()
	require.Equal(t, "0.190.0", settingService.GetOpenAICodexClientVersion(context.Background()))
	require.Equal(t, "codex_cli_rs/0.190.0"+codexCLIUserAgentSuffix, settingService.GetOpenAICodexCanonicalUserAgent(context.Background()))
}

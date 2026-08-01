//go:build unit

package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type contentModerationProxyRepoStub struct {
	ProxyRepository
	proxy *Proxy
	err   error
	calls int
}

func (r *contentModerationProxyRepoStub) GetByID(context.Context, int64) (*Proxy, error) {
	r.calls++
	return r.proxy, r.err
}

func TestContentModerationProxyURLCache(t *testing.T) {
	repo := &contentModerationProxyRepoStub{proxy: &Proxy{
		ID:       42,
		Protocol: "http",
		Host:     "127.0.0.1",
		Port:     8080,
	}}
	svc := &ContentModerationService{proxyRepo: repo}

	first, err := svc.resolveModerationProxyURL(context.Background(), 42)
	require.NoError(t, err)
	second, err := svc.resolveModerationProxyURL(context.Background(), 42)
	require.NoError(t, err)
	require.Equal(t, "http://127.0.0.1:8080", first)
	require.Equal(t, first, second)
	require.Equal(t, 1, repo.calls)
}

func TestContentModerationProxyResolutionFailsClosed(t *testing.T) {
	repo := &contentModerationProxyRepoStub{err: errors.New("database unavailable")}
	svc := &ContentModerationService{proxyRepo: repo}
	proxyID := int64(42)

	client, err := svc.moderationHTTPClient(context.Background(), &ContentModerationConfig{ProxyID: &proxyID})
	require.Nil(t, client)
	require.ErrorContains(t, err, "resolve moderation proxy 42")
}

func TestContentModerationProxyConfigUpdatePersistsAndClearsSelection(t *testing.T) {
	settings := &contentModerationTestSettingRepo{values: map[string]string{}}
	repo := &contentModerationProxyRepoStub{proxy: &Proxy{ID: 42}}
	svc := NewContentModerationService(settings, nil, nil, nil, nil, nil, nil)
	svc.proxyRepo = repo
	svc.moderationProxyCache.Store(&moderationProxyURLCacheEntry{proxyID: 7, url: "http://old", expiresAt: time.Now().Add(time.Minute)})
	proxyID := int64(42)

	view, err := svc.UpdateConfig(context.Background(), UpdateContentModerationConfigInput{ProxyID: &proxyID})
	require.NoError(t, err)
	require.Equal(t, &proxyID, view.ProxyID)
	require.Nil(t, svc.moderationProxyCache.Load())
	require.Contains(t, settings.values[SettingKeyContentModerationConfig], `"proxy_id":42`)

	clearProxy := int64(0)
	view, err = svc.UpdateConfig(context.Background(), UpdateContentModerationConfigInput{ProxyID: &clearProxy})
	require.NoError(t, err)
	require.Nil(t, view.ProxyID)
	require.NotContains(t, settings.values[SettingKeyContentModerationConfig], `"proxy_id"`)
}

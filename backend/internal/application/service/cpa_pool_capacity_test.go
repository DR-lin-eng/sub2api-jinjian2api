package service

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func cpaTestAccount(serverURL string, concurrency, perCredential int) *Account {
	return &Account{
		ID:          42,
		Platform:    PlatformOpenAI,
		Type:        AccountTypeAPIKey,
		Concurrency: concurrency,
		Credentials: map[string]any{
			CPAModeCredentialKey:                     true,
			CPAManagementURLCredentialKey:            serverURL,
			CPAManagementKeyCredentialKey:            "management-secret",
			CPAConcurrencyPerCredentialCredentialKey: perCredential,
		},
	}
}

func TestCPAPoolCapacityCountsOnlyCurrentlySchedulableCredentials(t *testing.T) {
	now := time.Date(2026, 7, 26, 12, 0, 0, 0, time.UTC)
	future := now.Add(time.Hour)
	past := now.Add(-time.Minute)
	var requests atomic.Int64
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requests.Add(1)
		require.Equal(t, "/v0/management/auth-files", r.URL.Path)
		require.Equal(t, "Bearer management-secret", r.Header.Get("Authorization"))
		require.NoError(t, json.NewEncoder(w).Encode(map[string]any{"files": []any{
			map[string]any{"status": "active", "disabled": false, "unavailable": false},
			map[string]any{"status": "active", "disabled": true, "unavailable": false},
			map[string]any{"status": "disabled", "disabled": false, "unavailable": false},
			map[string]any{"status": "error", "disabled": false, "unavailable": true, "next_retry_after": future},
			map[string]any{"status": "error", "disabled": false, "unavailable": true, "next_retry_after": past},
		}}))
	}))
	defer server.Close()

	service := newCPAPoolCapacityService()
	service.now = func() time.Time { return now }
	account := cpaTestAccount(server.URL, 10, 2)

	effective, available := service.effectiveConcurrency(context.Background(), account)
	require.True(t, available)
	require.Equal(t, 4, effective)
	require.Equal(t, int64(1), requests.Load())

	// The local account limit remains the hard ceiling even if CPA capacity is larger.
	account.Concurrency = 3
	effective, available = service.effectiveConcurrency(context.Background(), account)
	require.True(t, available)
	require.Equal(t, 3, effective)
	require.Equal(t, int64(1), requests.Load())
}

func TestCPAPoolCapacitySingleflightAndNinetySecondCache(t *testing.T) {
	var requests atomic.Int64
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		requests.Add(1)
		time.Sleep(25 * time.Millisecond)
		_, _ = w.Write([]byte(`{"files":[{"status":"active"}]}`))
	}))
	defer server.Close()

	service := newCPAPoolCapacityService()
	account := cpaTestAccount(server.URL, 100, 1)
	start := make(chan struct{})
	var wait sync.WaitGroup
	for range 64 {
		wait.Add(1)
		go func() {
			defer wait.Done()
			<-start
			effective, available := service.effectiveConcurrency(context.Background(), account)
			require.True(t, available)
			require.Equal(t, 1, effective)
		}()
	}
	close(start)
	wait.Wait()
	require.Equal(t, int64(1), requests.Load())

	effective, available := service.effectiveConcurrency(context.Background(), account)
	require.True(t, available)
	require.Equal(t, 1, effective)
	require.Equal(t, int64(1), requests.Load())
}

func TestCPAPoolCapacityUsesStaleSnapshotOnceThenFailsClosed(t *testing.T) {
	now := time.Date(2026, 7, 26, 12, 0, 0, 0, time.UTC)
	var requests atomic.Int64
	var fail atomic.Bool
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		requests.Add(1)
		if fail.Load() {
			http.Error(w, "management unavailable", http.StatusServiceUnavailable)
			return
		}
		_, _ = w.Write([]byte(`{"files":[{"status":"active"}]}`))
	}))
	defer server.Close()

	service := newCPAPoolCapacityService()
	service.now = func() time.Time { return now }
	account := cpaTestAccount(server.URL, 10, 1)

	effective, available := service.effectiveConcurrency(context.Background(), account)
	require.True(t, available)
	require.Equal(t, 1, effective)

	fail.Store(true)
	now = now.Add(91 * time.Second)
	effective, available = service.effectiveConcurrency(context.Background(), account)
	require.True(t, available)
	require.Equal(t, 1, effective)
	require.Equal(t, int64(2), requests.Load())

	now = now.Add(91 * time.Second)
	effective, available = service.effectiveConcurrency(context.Background(), account)
	require.False(t, available)
	require.Zero(t, effective)
	require.Equal(t, int64(3), requests.Load())
}

func TestGatewayNewSelectionResultReleasesAcquiredSlotWhenCPAPoolIsEmpty(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"files":[]}`))
	}))
	defer server.Close()

	gateway := &GatewayService{concurrencyService: NewConcurrencyService(nil)}
	released := atomic.Bool{}
	selection, err := gateway.newSelectionResult(
		context.Background(),
		cpaTestAccount(server.URL, 10, 1),
		true,
		func() { released.Store(true) },
		nil,
	)
	require.ErrorIs(t, err, errCPAPoolCapacityUnavailable)
	require.Nil(t, selection)
	require.True(t, released.Load())
}

func TestGatewayNewSelectionResultRefreshesWaitPlanConcurrency(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"files":[{"status":"active"},{"status":"active"}]}`))
	}))
	defer server.Close()

	gateway := &GatewayService{concurrencyService: NewConcurrencyService(nil)}
	waitPlan := &AccountWaitPlan{AccountID: 42, MaxConcurrency: 10, Timeout: time.Second, MaxWaiting: 5}
	selection, err := gateway.newSelectionResult(
		context.Background(),
		cpaTestAccount(server.URL, 10, 1),
		false,
		nil,
		waitPlan,
	)
	require.NoError(t, err)
	require.NotNil(t, selection)
	require.Equal(t, 2, selection.Account.Concurrency)
	require.Equal(t, 2, selection.WaitPlan.MaxConcurrency)
	require.Equal(t, 10, waitPlan.MaxConcurrency)
}

func TestNormalizeCPACredentials(t *testing.T) {
	credentials := map[string]any{
		CPAModeCredentialKey:                     true,
		CPAManagementURLCredentialKey:            " https://cpa.example.com/ ",
		CPAManagementKeyCredentialKey:            " secret ",
		CPAConcurrencyPerCredentialCredentialKey: float64(3),
	}
	require.NoError(t, NormalizeCPACredentials(AccountTypeAPIKey, credentials))
	require.Equal(t, "https://cpa.example.com", credentials[CPAManagementURLCredentialKey])
	require.Equal(t, "secret", credentials[CPAManagementKeyCredentialKey])
	require.Equal(t, 3, credentials[CPAConcurrencyPerCredentialCredentialKey])
	require.True(t, IsSensitiveCredentialKey(CPAManagementKeyCredentialKey))

	credentials[CPAModeCredentialKey] = false
	require.NoError(t, NormalizeCPACredentials(AccountTypeAPIKey, credentials))
	require.NotContains(t, credentials, CPAModeCredentialKey)
	require.NotContains(t, credentials, CPAManagementURLCredentialKey)
	require.NotContains(t, credentials, CPAManagementKeyCredentialKey)
	require.NotContains(t, credentials, CPAConcurrencyPerCredentialCredentialKey)
}

func TestNormalizeCPACredentialsRejectsIncompleteConfig(t *testing.T) {
	tests := []map[string]any{
		{CPAModeCredentialKey: true},
		{CPAModeCredentialKey: true, CPAManagementURLCredentialKey: "ftp://cpa.example.com", CPAManagementKeyCredentialKey: "secret"},
		{CPAModeCredentialKey: true, CPAManagementURLCredentialKey: "https://cpa.example.com", CPAManagementKeyCredentialKey: "secret", CPAConcurrencyPerCredentialCredentialKey: 0},
	}
	for _, credentials := range tests {
		require.Error(t, NormalizeCPACredentials(AccountTypeAPIKey, credentials))
	}
	require.Error(t, NormalizeCPACredentials(AccountTypeOAuth, map[string]any{
		CPAModeCredentialKey: true, CPAManagementURLCredentialKey: "https://cpa.example.com", CPAManagementKeyCredentialKey: "secret",
	}))
}

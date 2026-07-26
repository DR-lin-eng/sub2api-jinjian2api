package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"golang.org/x/sync/singleflight"
)

const (
	CPAModeCredentialKey                     = "cpa_mode"
	CPAManagementURLCredentialKey            = "cpa_management_url"
	CPAManagementKeyCredentialKey            = "cpa_management_key"
	CPAConcurrencyPerCredentialCredentialKey = "cpa_concurrency_per_credential"

	defaultCPAConcurrencyPerCredential = 1
	maxCPAConcurrencyPerCredential     = 10000
	defaultCPASnapshotTTL              = 90 * time.Second
	defaultCPAStaleSnapshotTTL         = 180 * time.Second
	defaultCPARequestTimeout           = 2 * time.Second
	maxCPAAuthFilesResponseBytes       = 2 << 20
)

var errCPAPoolCapacityUnavailable = errors.New("CPA pool capacity is unavailable")

type cpaPoolConfig struct {
	managementURL            string
	managementKey            string
	concurrencyPerCredential int
}

func cpaBool(value any) (bool, bool) {
	switch typed := value.(type) {
	case bool:
		return typed, true
	case string:
		parsed, err := strconv.ParseBool(strings.TrimSpace(typed))
		return parsed, err == nil
	default:
		return false, false
	}
}

func cpaPositiveInt(value any) (int, bool) {
	var number int64
	switch typed := value.(type) {
	case int:
		number = int64(typed)
	case int32:
		number = int64(typed)
	case int64:
		number = typed
	case float64:
		if math.Trunc(typed) != typed || typed > math.MaxInt64 || typed < math.MinInt64 {
			return 0, false
		}
		number = int64(typed)
	case json.Number:
		parsed, err := typed.Int64()
		if err != nil {
			return 0, false
		}
		number = parsed
	case string:
		parsed, err := strconv.ParseInt(strings.TrimSpace(typed), 10, 32)
		if err != nil {
			return 0, false
		}
		number = parsed
	default:
		return 0, false
	}
	if number <= 0 || number > maxCPAConcurrencyPerCredential {
		return 0, false
	}
	return int(number), true
}

func normalizeCPAManagementURL(raw string) (string, error) {
	raw = strings.TrimRight(strings.TrimSpace(raw), "/")
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		return "", errors.New("cpa_management_url must be an absolute HTTP(S) URL")
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return "", errors.New("cpa_management_url must use HTTP or HTTPS")
	}
	if parsed.User != nil || parsed.RawQuery != "" || parsed.Fragment != "" {
		return "", errors.New("cpa_management_url must not contain credentials, query parameters, or fragments")
	}
	return raw, nil
}

// NormalizeCPACredentials validates and canonicalizes the optional read-only
// CLIProxyAPI capacity integration stored in an API-key account's credentials.
func NormalizeCPACredentials(accountType string, credentials map[string]any) error {
	if credentials == nil {
		return nil
	}
	rawEnabled, exists := credentials[CPAModeCredentialKey]
	if !exists {
		return nil
	}
	enabled, ok := cpaBool(rawEnabled)
	if !ok {
		return infraerrors.BadRequest("INVALID_CPA_MODE", "cpa_mode must be a boolean")
	}
	if !enabled {
		delete(credentials, CPAModeCredentialKey)
		delete(credentials, CPAManagementURLCredentialKey)
		delete(credentials, CPAManagementKeyCredentialKey)
		delete(credentials, CPAConcurrencyPerCredentialCredentialKey)
		return nil
	}
	if accountType != AccountTypeAPIKey {
		return infraerrors.BadRequest("CPA_MODE_REQUIRES_API_KEY_ACCOUNT", "CPA mode is only supported for API-key accounts")
	}

	managementURL, ok := credentials[CPAManagementURLCredentialKey].(string)
	if !ok || strings.TrimSpace(managementURL) == "" {
		return infraerrors.BadRequest("CPA_MANAGEMENT_URL_REQUIRED", "cpa_management_url is required when CPA mode is enabled")
	}
	normalizedURL, err := normalizeCPAManagementURL(managementURL)
	if err != nil {
		return infraerrors.BadRequest("INVALID_CPA_MANAGEMENT_URL", err.Error())
	}
	managementKey, ok := credentials[CPAManagementKeyCredentialKey].(string)
	if !ok || strings.TrimSpace(managementKey) == "" {
		return infraerrors.BadRequest("CPA_MANAGEMENT_KEY_REQUIRED", "cpa_management_key is required when CPA mode is enabled")
	}

	perCredential := defaultCPAConcurrencyPerCredential
	if raw, provided := credentials[CPAConcurrencyPerCredentialCredentialKey]; provided {
		parsed, valid := cpaPositiveInt(raw)
		if !valid {
			return infraerrors.BadRequest(
				"INVALID_CPA_CONCURRENCY_PER_CREDENTIAL",
				fmt.Sprintf("cpa_concurrency_per_credential must be between 1 and %d", maxCPAConcurrencyPerCredential),
			)
		}
		perCredential = parsed
	}

	credentials[CPAModeCredentialKey] = true
	credentials[CPAManagementURLCredentialKey] = normalizedURL
	credentials[CPAManagementKeyCredentialKey] = strings.TrimSpace(managementKey)
	credentials[CPAConcurrencyPerCredentialCredentialKey] = perCredential
	return nil
}

func cpaPoolConfigFromAccount(account *Account) (cpaPoolConfig, bool) {
	if account == nil || account.Type != AccountTypeAPIKey || account.Credentials == nil {
		return cpaPoolConfig{}, false
	}
	enabled, ok := cpaBool(account.Credentials[CPAModeCredentialKey])
	if !ok || !enabled {
		return cpaPoolConfig{}, false
	}
	managementURL, okURL := account.Credentials[CPAManagementURLCredentialKey].(string)
	managementKey, okKey := account.Credentials[CPAManagementKeyCredentialKey].(string)
	managementURL = strings.TrimSpace(managementURL)
	managementKey = strings.TrimSpace(managementKey)
	if !okURL || !okKey || managementURL == "" || managementKey == "" {
		return cpaPoolConfig{}, true
	}
	perCredential := defaultCPAConcurrencyPerCredential
	if parsed, ok := cpaPositiveInt(account.Credentials[CPAConcurrencyPerCredentialCredentialKey]); ok {
		perCredential = parsed
	}
	return cpaPoolConfig{
		managementURL:            managementURL,
		managementKey:            managementKey,
		concurrencyPerCredential: perCredential,
	}, true
}

func cpaAuthFilesURL(managementURL string) string {
	base := strings.TrimRight(strings.TrimSpace(managementURL), "/")
	switch {
	case strings.HasSuffix(base, "/v0/management/auth-files"):
		return base
	case strings.HasSuffix(base, "/v0/management"):
		return base + "/auth-files"
	default:
		return base + "/v0/management/auth-files"
	}
}

type cpaAuthFile struct {
	Status         string     `json:"status"`
	Disabled       bool       `json:"disabled"`
	Unavailable    bool       `json:"unavailable"`
	NextRetryAfter *time.Time `json:"next_retry_after"`
}

type cpaAuthFilesResponse struct {
	Files []cpaAuthFile `json:"files"`
}

type cpaCapacitySnapshot struct {
	schedulableCredentials int
	fetchedAt              time.Time
}

type cpaCapacityCacheEntry struct {
	snapshot      *cpaCapacitySnapshot
	lastAttemptAt time.Time
	lastErr       error
}

type cpaPoolCapacityService struct {
	client   *http.Client
	now      func() time.Time
	cacheTTL time.Duration
	staleTTL time.Duration
	cache    sync.Map
	group    singleflight.Group
}

func newCPAPoolCapacityService() *cpaPoolCapacityService {
	return &cpaPoolCapacityService{
		client: &http.Client{
			Timeout: defaultCPARequestTimeout,
			CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
		now:      time.Now,
		cacheTTL: defaultCPASnapshotTTL,
		staleTTL: defaultCPAStaleSnapshotTTL,
	}
}

func (s *cpaPoolCapacityService) cacheKey(config cpaPoolConfig) string {
	digest := sha256.Sum256([]byte(config.managementKey))
	return config.managementURL + "\x00" + hex.EncodeToString(digest[:])
}

func (s *cpaPoolCapacityService) cachedSnapshot(key string, now time.Time) (*cpaCapacitySnapshot, error, bool) {
	raw, ok := s.cache.Load(key)
	if !ok {
		return nil, nil, false
	}
	entry, ok := raw.(cpaCapacityCacheEntry)
	if !ok {
		return nil, nil, false
	}
	if entry.snapshot != nil && now.Sub(entry.snapshot.fetchedAt) < s.cacheTTL {
		return entry.snapshot, nil, true
	}
	if entry.lastErr != nil && now.Sub(entry.lastAttemptAt) < s.cacheTTL {
		if entry.snapshot != nil && now.Sub(entry.snapshot.fetchedAt) <= s.staleTTL {
			return entry.snapshot, nil, true
		}
		return nil, entry.lastErr, true
	}
	return nil, nil, false
}

func (s *cpaPoolCapacityService) snapshot(ctx context.Context, config cpaPoolConfig) (*cpaCapacitySnapshot, error) {
	if s == nil {
		return nil, errCPAPoolCapacityUnavailable
	}
	now := s.now()
	key := s.cacheKey(config)
	if snapshot, err, ok := s.cachedSnapshot(key, now); ok {
		return snapshot, err
	}

	value, err, _ := s.group.Do(key, func() (any, error) {
		checkNow := s.now()
		if snapshot, cachedErr, ok := s.cachedSnapshot(key, checkNow); ok {
			return snapshot, cachedErr
		}
		previousRaw, _ := s.cache.Load(key)
		previous, _ := previousRaw.(cpaCapacityCacheEntry)
		snapshot, fetchErr := s.fetch(ctx, config, checkNow)
		if fetchErr != nil {
			s.cache.Store(key, cpaCapacityCacheEntry{
				snapshot:      previous.snapshot,
				lastAttemptAt: checkNow,
				lastErr:       fetchErr,
			})
			if previous.snapshot != nil && checkNow.Sub(previous.snapshot.fetchedAt) <= s.staleTTL {
				return previous.snapshot, nil
			}
			return nil, fetchErr
		}
		s.cache.Store(key, cpaCapacityCacheEntry{snapshot: snapshot, lastAttemptAt: checkNow})
		return snapshot, nil
	})
	if err != nil {
		return nil, err
	}
	snapshot, ok := value.(*cpaCapacitySnapshot)
	if !ok || snapshot == nil {
		return nil, errCPAPoolCapacityUnavailable
	}
	return snapshot, nil
}

func (s *cpaPoolCapacityService) fetch(ctx context.Context, config cpaPoolConfig, now time.Time) (*cpaCapacitySnapshot, error) {
	baseCtx := context.Background()
	if ctx != nil {
		baseCtx = context.WithoutCancel(ctx)
	}
	requestCtx, cancel := context.WithTimeout(baseCtx, defaultCPARequestTimeout)
	defer cancel()
	req, err := http.NewRequestWithContext(requestCtx, http.MethodGet, cpaAuthFilesURL(config.managementURL), nil)
	if err != nil {
		return nil, fmt.Errorf("build CPA auth-files request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+config.managementKey)
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("query CPA auth-files: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("query CPA auth-files: unexpected HTTP status %d", resp.StatusCode)
	}
	var payload cpaAuthFilesResponse
	decoder := json.NewDecoder(io.LimitReader(resp.Body, maxCPAAuthFilesResponseBytes))
	if err := decoder.Decode(&payload); err != nil {
		return nil, fmt.Errorf("decode CPA auth-files response: %w", err)
	}

	schedulable := 0
	for _, file := range payload.Files {
		if file.Disabled || strings.EqualFold(strings.TrimSpace(file.Status), "disabled") {
			continue
		}
		if file.Unavailable && file.NextRetryAfter != nil && file.NextRetryAfter.After(now) {
			continue
		}
		schedulable++
	}
	return &cpaCapacitySnapshot{schedulableCredentials: schedulable, fetchedAt: now}, nil
}

func (s *cpaPoolCapacityService) effectiveConcurrency(ctx context.Context, account *Account) (int, bool) {
	config, enabled := cpaPoolConfigFromAccount(account)
	if !enabled {
		return account.Concurrency, true
	}
	if config.managementURL == "" || config.managementKey == "" {
		return 0, false
	}
	snapshot, err := s.snapshot(ctx, config)
	if err != nil {
		slog.Warn("cpa_pool_capacity_unavailable", "account_id", account.ID, "management_url", config.managementURL, "error", err)
		return 0, false
	}
	if snapshot.schedulableCredentials <= 0 {
		return 0, false
	}
	capacity64 := int64(snapshot.schedulableCredentials) * int64(config.concurrencyPerCredential)
	maxInt := int64(^uint(0) >> 1)
	if capacity64 > maxInt {
		capacity64 = maxInt
	}
	capacity := int(capacity64)
	if account.Concurrency > 0 && account.Concurrency < capacity {
		capacity = account.Concurrency
	}
	return capacity, capacity > 0
}

func (s *ConcurrencyService) applyCPAPoolCapacity(ctx context.Context, account *Account) (*Account, bool) {
	if account == nil {
		return nil, false
	}
	if s == nil || s.cpaPoolCapacity == nil {
		return account, true
	}
	effective, available := s.cpaPoolCapacity.effectiveConcurrency(ctx, account)
	if !available {
		return nil, false
	}
	if effective == account.Concurrency {
		return account, true
	}
	copy := *account
	copy.Concurrency = effective
	return &copy, true
}

func (s *ConcurrencyService) applyCPAPoolCapacityBatch(ctx context.Context, accounts []Account) []Account {
	if len(accounts) == 0 || s == nil || s.cpaPoolCapacity == nil {
		return accounts
	}
	filtered := make([]Account, 0, len(accounts))
	for index := range accounts {
		account, available := s.applyCPAPoolCapacity(ctx, &accounts[index])
		if !available || account == nil {
			continue
		}
		filtered = append(filtered, *account)
	}
	return filtered
}

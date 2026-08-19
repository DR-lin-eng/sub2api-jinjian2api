package securityaudit

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/redis/go-redis/v9"
)

type activeConfigSnapshot struct {
	storage  storageConfig
	active   ActiveConfig
	loadedAt time.Time
}

type ConfigManager struct {
	db        *sql.DB
	settings  service.SettingRepository
	encryptor SecretEncryptor
	clock     Clock
	// encryptionKeyConfigured mirrors cfg.Totp.EncryptionKeyConfigured. With an
	// auto-generated (per-boot) key, newly saved endpoint tokens would become
	// undecryptable after the next restart, so Save rejects them (issue #4887).
	encryptionKeyConfigured bool

	snapshot atomic.Pointer[activeConfigSnapshot]
	expected atomic.Int64
	// expectedBlocking records the last storage intent that could be decoded,
	// independently of whether endpoint credentials or the full config could be
	// activated. A config version alone cannot distinguish async from blocking.
	expectedBlocking atomic.Bool
	// configUntrusted is set when a load/reload fails before a trustworthy
	// snapshot is installed. Combined with expectedBlocking, EffectiveMode
	// fails closed so a persisted blocking policy cannot be silently skipped
	// after startup or invalidation errors. Without blocking intent, untrusted
	// alone must not force ModeBlocking—Prompt Audit is default-off and must
	// not take the gateway down for every API request (see issue #4560).
	configUntrusted atomic.Bool

	stateMu       sync.RWMutex
	lastLoadError string
	lastErrorAt   *time.Time

	lifecycleMu sync.Mutex
	cancel      context.CancelFunc
	wg          sync.WaitGroup
}

func NewConfigManager(db *sql.DB, settings service.SettingRepository, _ *redis.Client, encryptor service.SecretEncryptor, cfg *config.Config) *ConfigManager {
	return &ConfigManager{
		db: db, settings: settings, encryptor: encryptor, clock: realClock{},
		encryptionKeyConfigured: cfg != nil && cfg.Totp.EncryptionKeyConfigured,
	}
}

func (m *ConfigManager) Start(ctx context.Context) error {
	if m == nil {
		return errors.New("prompt audit config manager unavailable")
	}
	m.lifecycleMu.Lock()
	if m.cancel != nil {
		m.lifecycleMu.Unlock()
		return nil
	}
	runCtx, cancel := context.WithCancel(ctx)
	m.cancel = cancel
	m.lifecycleMu.Unlock()
	loadErr := m.Reload(runCtx)
	if loadErr != nil {
		m.markConfigUntrusted()
	}
	m.wg.Add(1)
	go m.refreshLoop(runCtx)
	return loadErr
}

func (m *ConfigManager) Shutdown(_ context.Context) error {
	if m == nil {
		return nil
	}
	m.lifecycleMu.Lock()
	cancel := m.cancel
	m.cancel = nil
	m.lifecycleMu.Unlock()
	if cancel != nil {
		cancel()
	}
	m.wg.Wait()
	return nil
}

func (m *ConfigManager) Reload(ctx context.Context) error {
	if m == nil || m.settings == nil {
		m.markUntrustedIfNoActiveSnapshot()
		return errors.New("prompt audit setting repository unavailable")
	}
	values, err := m.settings.GetMultiple(ctx, []string{SettingKeyPromptAuditConfig})
	if err != nil {
		m.recordLoadError(err)
		m.markUntrustedIfNoActiveSnapshot()
		return err
	}
	m.observeExpectedState(values[SettingKeyPromptAuditConfig])
	storage, err := ParseStorageConfig(values[SettingKeyPromptAuditConfig])
	if err != nil {
		m.recordLoadError(err)
		m.markUntrustedIfNoActiveSnapshot()
		return err
	}
	m.expected.Store(storage.ConfigVersion)
	m.expectedBlocking.Store(storage.Enabled && storage.BlockingEnabled)
	active, err := ActiveFromStorage(storage, true, m.encryptor)
	if err != nil {
		m.recordLoadError(err)
		// expectedBlocking may already require fail-closed via BlockingActivationDegraded.
		m.markUntrustedIfNoActiveSnapshot()
		return err
	}
	now := m.clock.Now()
	previous := m.snapshot.Load()
	m.snapshot.Store(&activeConfigSnapshot{storage: cloneStorageConfig(storage), active: cloneActiveConfig(active), loadedAt: now})
	m.configUntrusted.Store(false)
	m.clearLoadError()
	m.logInvalidTokenEndpoints(previous, active)
	if promptAuditConfigChanged(previous, storage, active) {
		LogInfo(EventConfigLoaded, map[string]any{
			"config_version": storage.ConfigVersion, "status": "loaded",
		})
	}
	return nil
}

func promptAuditConfigChanged(previous *activeConfigSnapshot, storage storageConfig, active ActiveConfig) bool {
	if previous == nil {
		return true
	}
	prior := previous.storage
	return prior.Enabled != storage.Enabled ||
		prior.BlockingEnabled != storage.BlockingEnabled ||
		prior.BlockingLatestTurnOnly != storage.BlockingLatestTurnOnly ||
		prior.StorePassEvents != storage.StorePassEvents ||
		prior.Strategy != storage.Strategy ||
		prior.WorkerCount != storage.WorkerCount ||
		prior.QueueCapacity != storage.QueueCapacity ||
		prior.AllGroups != storage.AllGroups ||
		prior.ConfigVersion != storage.ConfigVersion ||
		!slices.Equal(prior.Scanners, storage.Scanners) ||
		!slices.Equal(prior.GroupIDs, storage.GroupIDs) ||
		!slices.Equal(prior.Endpoints, storage.Endpoints)
}

// logInvalidTokenEndpoints warns once per change (not on every 5s refresh)
// when stored endpoint tokens cannot be decrypted with the current key.
func (m *ConfigManager) logInvalidTokenEndpoints(previous *activeConfigSnapshot, active ActiveConfig) {
	invalid := active.InvalidTokenEndpointIDs()
	if len(invalid) == 0 {
		return
	}
	if previous != nil {
		prior := previous.active.InvalidTokenEndpointIDs()
		if len(prior) == len(invalid) {
			same := true
			for i := range invalid {
				if prior[i] != invalid[i] {
					same = false
					break
				}
			}
			if same && previous.active.ConfigVersion == active.ConfigVersion {
				return
			}
		}
	}
	LogWarn(EventConfigTokenInvalid, map[string]any{
		"config_version": active.ConfigVersion, "status": "degraded",
		"error_code": "endpoint_token_undecryptable", "guard_endpoint_id": strings.Join(invalid, ","),
	})
}

func (m *ConfigManager) Active() (ActiveConfig, bool) {
	if m == nil {
		return ActiveConfig{}, false
	}
	snapshot := m.snapshot.Load()
	if snapshot == nil {
		return ActiveConfig{}, false
	}
	return cloneActiveConfig(snapshot.active), true
}

// activeReadOnly returns the immutable snapshot owned by ConfigManager. Callers
// must not expose or mutate its slice fields.
func (m *ConfigManager) activeReadOnly() (*activeConfigSnapshot, bool) {
	if m == nil {
		return nil, false
	}
	snapshot := m.snapshot.Load()
	return snapshot, snapshot != nil
}

func (m *ConfigManager) BlockingActivationDegraded() bool {
	if m == nil {
		return false
	}
	// Fail closed only when storage intent requires blocking. Untrusted config
	// without blocking intent must remain ModeOff so administrators can still
	// operate the gateway and turn Prompt Audit off after a failed reload.
	if !m.expectedBlocking.Load() {
		return false
	}
	if m.configUntrusted.Load() {
		return true
	}
	snapshot, ok := m.activeReadOnly()
	if !ok {
		return true
	}
	// A still-active weaker snapshot after a failed blocking activation must not
	// keep serving allow decisions under the old off/async mode.
	return snapshot.active.EffectiveMode() != ModeBlocking
}

func (m *ConfigManager) EffectiveMode() Mode {
	if m != nil && m.BlockingActivationDegraded() {
		return ModeBlocking
	}
	snapshot, ok := m.activeReadOnly()
	if !ok {
		return ModeOff
	}
	return snapshot.active.EffectiveMode()
}

func (m *ConfigManager) markConfigUntrusted() {
	if m == nil {
		return
	}
	m.configUntrusted.Store(true)
}

func (m *ConfigManager) markUntrustedIfNoActiveSnapshot() {
	if m == nil {
		return
	}
	if _, ok := m.activeReadOnly(); !ok {
		m.markConfigUntrusted()
	}
}

func (m *ConfigManager) Public() (PublicConfig, error) {
	if m == nil {
		return PublicConfig{}, infraerrors.ServiceUnavailable(ErrorCodeConfigUnavailable, "提示词审计配置暂不可用")
	}
	snapshot := m.snapshot.Load()
	if snapshot == nil {
		return PublicConfig{}, infraerrors.ServiceUnavailable(ErrorCodeConfigUnavailable, "提示词审计配置暂不可用")
	}
	return PublicFromStorage(cloneStorageConfig(snapshot.storage), true, snapshot.active.InvalidTokenEndpointIDs()), nil
}

func (m *ConfigManager) Save(ctx context.Context, req UpdateConfigRequest, actorID int64) (PublicConfig, error) {
	if m == nil || m.db == nil || m.encryptor == nil {
		return PublicConfig{}, errors.New("prompt audit config persistence unavailable")
	}
	if req.ExpectedConfigVersion < 1 {
		return PublicConfig{}, infraerrors.BadRequest("prompt_audit_expected_config_version_required", "必须提供有效的配置版本")
	}
	tx, err := m.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		return PublicConfig{}, err
	}
	defer func() { _ = tx.Rollback() }()
	if _, err := tx.ExecContext(ctx, `SELECT pg_advisory_xact_lock($1)`, promptAuditConfigLockKey); err != nil {
		return PublicConfig{}, err
	}
	current := DefaultStorageConfig()
	var raw string
	err = tx.QueryRowContext(ctx, `SELECT value FROM settings WHERE key=$1 FOR UPDATE`, SettingKeyPromptAuditConfig).Scan(&raw)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return PublicConfig{}, err
	}
	if err == nil {
		current, err = ParseStorageConfig(raw)
		if err != nil {
			return PublicConfig{}, err
		}
	}
	if current.ConfigVersion != req.ExpectedConfigVersion {
		return PublicConfig{}, infraerrors.Conflict(ErrorCodeConfigConflict, "提示词审计配置已被其他管理员更新")
	}
	next, err := m.buildNextStorage(current, req, actorID)
	if err != nil {
		return PublicConfig{}, err
	}
	next.ConfigVersion = current.ConfigVersion + 1
	next.UpdatedAt = m.clock.Now()
	next.UpdatedBy = actorID
	next.ChangeSummary = changeSummary(next)
	rawNext, err := json.Marshal(next)
	if err != nil {
		return PublicConfig{}, err
	}
	if _, err := tx.ExecContext(ctx, `
		INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,NOW())
		ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=EXCLUDED.updated_at`,
		SettingKeyPromptAuditConfig, string(rawNext)); err != nil {
		return PublicConfig{}, err
	}
	if err := tx.Commit(); err != nil {
		return PublicConfig{}, err
	}
	active, err := ActiveFromStorage(next, true, m.encryptor)
	if err != nil {
		return PublicConfig{}, err
	}
	m.expected.Store(next.ConfigVersion)
	m.expectedBlocking.Store(next.Enabled && next.BlockingEnabled)
	previous := m.snapshot.Load()
	m.snapshot.Store(&activeConfigSnapshot{storage: cloneStorageConfig(next), active: cloneActiveConfig(active), loadedAt: m.clock.Now()})
	// A successful admin save installs a trustworthy snapshot; clear any prior
	// fail-closed degradation so disabling audit actually takes effect.
	m.configUntrusted.Store(false)
	m.clearLoadError()
	m.logInvalidTokenEndpoints(previous, active)
	LogInfo(EventConfigUpdated, map[string]any{
		"config_version": next.ConfigVersion, "status": "updated",
	})
	return PublicFromStorage(next, true, active.InvalidTokenEndpointIDs()), nil
}

func (m *ConfigManager) buildNextStorage(current storageConfig, req UpdateConfigRequest, actorID int64) (storageConfig, error) {
	if err := validateUpdateConfigRequest(req); err != nil {
		return storageConfig{}, err
	}
	currentByID := make(map[string]StorageEndpoint, len(current.Endpoints))
	for _, endpoint := range current.Endpoints {
		currentByID[endpoint.ID] = endpoint
	}
	next := storageConfig{
		Enabled: req.Enabled, BlockingEnabled: req.BlockingEnabled, BlockingLatestTurnOnly: req.BlockingLatestTurnOnly, StorePassEvents: req.StorePassEvents,
		Strategy: strings.TrimSpace(req.Strategy), WorkerCount: req.WorkerCount,
		QueueCapacity: req.QueueCapacity, Scanners: append([]string(nil), req.Scanners...),
		AllGroups: req.AllGroups, GroupIDs: append([]int64(nil), req.GroupIDs...),
		ConfigVersion: current.ConfigVersion, UpdatedBy: actorID,
		Endpoints: make([]StorageEndpoint, 0, len(req.Endpoints)),
	}
	for _, endpoint := range req.Endpoints {
		baseURL, err := NormalizeBaseURL(endpoint.BaseURL)
		if err != nil {
			return storageConfig{}, err
		}
		stored := StorageEndpoint{
			ID: strings.TrimSpace(endpoint.ID), Name: strings.TrimSpace(endpoint.Name),
			Protocol: strings.TrimSpace(endpoint.Protocol), BaseURL: baseURL, Model: strings.TrimSpace(endpoint.Model),
			TimeoutMS: endpoint.TimeoutMS, InputLimit: endpoint.InputLimit, Enabled: endpoint.Enabled,
		}
		old, hadOld := currentByID[stored.ID]
		switch {
		case endpoint.ClearToken:
			stored.TokenCiphertext = ""
		case strings.TrimSpace(endpoint.Token) != "":
			if !m.encryptionKeyConfigured {
				return storageConfig{}, infraerrors.BadRequest(ErrorCodeEncryptionKeyRequired,
					"未配置固定加密密钥，审计节点 Token 将在服务重启后失效。请先设置 TOTP_ENCRYPTION_KEY 环境变量（64 位十六进制）并重启服务")
			}
			ciphertext, err := m.encryptor.Encrypt(strings.TrimSpace(endpoint.Token))
			if err != nil {
				return storageConfig{}, fmt.Errorf("encrypt prompt audit endpoint token: %w", err)
			}
			stored.TokenCiphertext = ciphertext
		case hadOld:
			stored.TokenCiphertext = old.TokenCiphertext
		}
		next.Endpoints = append(next.Endpoints, stored)
	}
	normalizeStorageConfig(&next)
	if err := validateStorageConfig(next); err != nil {
		return storageConfig{}, err
	}
	return next, nil
}

func (m *ConfigManager) RuntimeState() (expected int64, active int64, loadedAt *time.Time, loadError string) {
	if m == nil {
		return 1, 0, nil, "config_manager_unavailable"
	}
	expected = m.expected.Load()
	if expected < 1 {
		expected = 1
	}
	if snapshot := m.snapshot.Load(); snapshot != nil {
		active = snapshot.active.ConfigVersion
		value := snapshot.loadedAt
		loadedAt = &value
	}
	m.stateMu.RLock()
	loadError = m.lastLoadError
	m.stateMu.RUnlock()
	return
}

func (m *ConfigManager) Encrypt(value string) (string, error) { return m.encryptor.Encrypt(value) }
func (m *ConfigManager) Decrypt(value string) (string, error) { return m.encryptor.Decrypt(value) }

func (m *ConfigManager) observeExpectedState(raw string, _ ...bool) {
	if m == nil {
		return
	}
	if strings.TrimSpace(raw) == "" {
		m.expected.Store(1)
		m.expectedBlocking.Store(false)
		return
	}
	var intent struct {
		Enabled         bool  `json:"enabled"`
		BlockingEnabled bool  `json:"blocking_enabled"`
		ConfigVersion   int64 `json:"config_version"`
	}
	if err := json.Unmarshal([]byte(raw), &intent); err != nil {
		return
	}
	if intent.ConfigVersion < 1 {
		intent.ConfigVersion = 1
	}
	m.expected.Store(intent.ConfigVersion)
	m.expectedBlocking.Store(intent.Enabled && intent.BlockingEnabled)
}

func (m *ConfigManager) refreshLoop(ctx context.Context) {
	defer m.wg.Done()
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if err := m.Reload(ctx); err != nil {
				LogWarn(EventConfigReloadDegraded, map[string]any{"status": "degraded", "error_code": "config_ttl_reload_failed"})
			}
		}
	}
}

func (m *ConfigManager) recordLoadError(_ error) {
	if m == nil {
		return
	}
	now := m.clock.Now()
	m.stateMu.Lock()
	m.lastLoadError = stableErrorMessage("config_load_failed")
	m.lastErrorAt = &now
	m.stateMu.Unlock()
}

func (m *ConfigManager) clearLoadError() {
	m.stateMu.Lock()
	m.lastLoadError = ""
	m.lastErrorAt = nil
	m.stateMu.Unlock()
}

func cloneStorageConfig(cfg storageConfig) storageConfig {
	cfg.Scanners = append([]string(nil), cfg.Scanners...)
	cfg.GroupIDs = append([]int64(nil), cfg.GroupIDs...)
	cfg.Endpoints = append([]StorageEndpoint(nil), cfg.Endpoints...)
	return cfg
}

func cloneActiveConfig(cfg ActiveConfig) ActiveConfig {
	cfg.Scanners = append([]string(nil), cfg.Scanners...)
	cfg.GroupIDs = append([]int64(nil), cfg.GroupIDs...)
	cfg.Endpoints = append([]ActiveEndpoint(nil), cfg.Endpoints...)
	return cfg
}

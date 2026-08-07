//go:build integration

package repository

import (
	"context"
	"database/sql"
	"testing"

	"github.com/Wei-Shaw/sub2api/migrations"
	"github.com/lib/pq"
	"github.com/stretchr/testify/require"
)

func TestSingleAdminMigrationPreservesGatewayOwnershipAndCredentials(t *testing.T) {
	ctx := context.Background()
	tx := testTx(t)
	schema := "single_admin_migration_fixture"

	_, err := tx.ExecContext(ctx, "CREATE SCHEMA "+pq.QuoteIdentifier(schema))
	require.NoError(t, err)
	_, err = tx.ExecContext(ctx, "SET LOCAL search_path = "+pq.QuoteIdentifier(schema)+", pg_catalog")
	require.NoError(t, err)

	_, err = tx.ExecContext(ctx, `
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    totp_secret_encrypted TEXT,
    balance DECIMAL(20,8),
    frozen_balance DECIMAL(20,8),
    signup_source VARCHAR(20),
    wechat VARCHAR(100),
    balance_notify_enabled BOOLEAN,
    balance_notify_threshold_type VARCHAR(10),
    balance_notify_threshold DECIMAL(20,8),
    balance_notify_extra_emails TEXT,
    total_recharged DECIMAL(20,8),
    rpm_limit INTEGER
);
CREATE TABLE api_keys (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quota DECIMAL(20,8),
    quota_used DECIMAL(20,8),
    rate_limit_5h DECIMAL(20,8),
    rate_limit_1d DECIMAL(20,8),
    rate_limit_7d DECIMAL(20,8),
    usage_5h DECIMAL(20,8),
    usage_1d DECIMAL(20,8),
    usage_7d DECIMAL(20,8),
    window_5h_start TIMESTAMPTZ,
    window_1d_start TIMESTAMPTZ,
    window_7d_start TIMESTAMPTZ
);
CREATE TABLE groups (
    id BIGINT PRIMARY KEY,
    peak_rate_enabled BOOLEAN,
    peak_start VARCHAR(5),
    peak_end VARCHAR(5),
    peak_rate_multiplier DECIMAL(10,4),
    is_exclusive BOOLEAN,
    subscription_type VARCHAR(20),
    daily_limit_usd DECIMAL(20,8),
    weekly_limit_usd DECIMAL(20,8),
    monthly_limit_usd DECIMAL(20,8),
    default_validity_days INTEGER,
    allow_batch_image_generation BOOLEAN,
    batch_image_discount_multiplier DECIMAL(10,4),
    batch_image_hold_multiplier DECIMAL(10,4)
);
CREATE TABLE usage_logs (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_key_id BIGINT NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    subscription_id BIGINT,
    billing_type SMALLINT
);
CREATE TABLE channel_monitors (
    id BIGINT PRIMARY KEY,
    created_by BIGINT NOT NULL
);
CREATE TABLE usage_dashboard_hourly (
    bucket_start TIMESTAMPTZ PRIMARY KEY,
    active_users BIGINT NOT NULL DEFAULT 0
);
CREATE TABLE usage_dashboard_daily (
    bucket_date DATE PRIMARY KEY,
    active_users BIGINT NOT NULL DEFAULT 0
);
CREATE TABLE passkey_user_handles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    handle BYTEA NOT NULL
);
CREATE TABLE passkey_credentials (
    credential_id BYTEA PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE user_avatars (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT NOT NULL
);
`)
	require.NoError(t, err)

	removedTables := []string{
		"announcement_reads",
		"announcements",
		"auth_identity_channels",
		"identity_adoption_decisions",
		"pending_auth_sessions",
		"auth_identities",
		"auth_identity_migration_reports",
		"batch_image_events",
		"batch_image_items",
		"batch_image_jobs",
		"chat_messages",
		"chat_conversations",
		"payment_audit_logs",
		"payment_orders",
		"payment_provider_instances",
		"promo_code_usages",
		"promo_codes",
		"redeem_code_usages",
		"redeem_codes",
		"billing_usage_entries",
		"usage_billing_jobs",
		"usage_billing_dead_letters",
		"usage_billing_dedup_archive",
		"usage_billing_dedup",
		"user_subscriptions",
		"subscription_plans",
		"user_allowed_groups",
		"orphan_allowed_groups_audit",
		"user_attribute_values",
		"user_attribute_definitions",
		"user_platform_quotas",
		"user_group_rate_multipliers",
		"user_provider_default_grants",
		"user_affiliate_ledger",
		"user_affiliates",
		"usage_cleanup_tasks",
		"usage_dashboard_hourly_users",
		"usage_dashboard_daily_users",
	}
	for _, table := range removedTables {
		_, err = tx.ExecContext(ctx, "CREATE TABLE "+pq.QuoteIdentifier(table)+" (id BIGINT)")
		require.NoErrorf(t, err, "create removed-table fixture %s", table)
	}

	_, err = tx.ExecContext(ctx, `
INSERT INTO users (id, email, password_hash, role, status, deleted_at, totp_secret_encrypted)
VALUES
    (10, 'member@example.test', 'hash-10', 'user', 'active', NULL, NULL),
    (20, 'keeper@example.test', 'hash-20', 'admin', 'active', NULL, 'keeper-totp'),
    (30, 'old-admin@example.test', 'hash-30', 'admin', 'disabled', NOW(), 'old-totp');
INSERT INTO api_keys (id, user_id) VALUES (101, 10), (102, 30);
INSERT INTO usage_logs (id, user_id, api_key_id, subscription_id, billing_type)
VALUES (201, 10, 101, 1, 0), (202, 30, 102, 2, 1);
INSERT INTO channel_monitors (id, created_by) VALUES (401, 30);
INSERT INTO passkey_user_handles (user_id, handle) VALUES (20, decode('20', 'hex')), (30, decode('30', 'hex'));
INSERT INTO passkey_credentials (credential_id, user_id) VALUES (decode('21', 'hex'), 20), (decode('31', 'hex'), 30);
INSERT INTO user_avatars (user_id, avatar_url) VALUES (20, 'keeper-avatar'), (30, 'old-avatar');
`)
	require.NoError(t, err)

	migrationSQL, err := migrations.FS.ReadFile("202_simplify_single_admin_gateway.sql")
	require.NoError(t, err)
	require.NoError(t, execMigrationSQL(ctx, tx, migrationSQL))
	require.NoError(t, execMigrationSQL(ctx, tx, migrationSQL), "migration must be replay-safe")

	var (
		userID     int64
		role       string
		status     string
		deleted    bool
		totpSecret string
	)
	err = tx.QueryRowContext(ctx, `
SELECT id, role, status, deleted_at IS NOT NULL, totp_secret_encrypted
FROM users
`).Scan(&userID, &role, &status, &deleted, &totpSecret)
	require.NoError(t, err)
	require.Equal(t, int64(20), userID)
	require.Equal(t, "admin", role)
	require.Equal(t, "active", status)
	require.False(t, deleted)
	require.Equal(t, "keeper-totp", totpSecret)

	for _, table := range []string{"api_keys", "usage_logs"} {
		var owners []int64
		rows, queryErr := tx.QueryContext(ctx, "SELECT DISTINCT user_id FROM "+pq.QuoteIdentifier(table))
		require.NoError(t, queryErr)
		for rows.Next() {
			var owner int64
			require.NoError(t, rows.Scan(&owner))
			owners = append(owners, owner)
		}
		require.NoError(t, rows.Err())
		require.NoError(t, rows.Close())
		require.Equal(t, []int64{20}, owners, "all %s rows must belong to the keeper", table)
	}

	var monitorCreatedBy int64
	require.NoError(t, tx.QueryRowContext(ctx, "SELECT created_by FROM channel_monitors WHERE id = 401").Scan(&monitorCreatedBy))
	require.Equal(t, int64(20), monitorCreatedBy)

	for _, table := range []string{"passkey_user_handles", "passkey_credentials", "user_avatars"} {
		var count int
		require.NoError(t, tx.QueryRowContext(ctx, "SELECT COUNT(*) FROM "+pq.QuoteIdentifier(table)+" WHERE user_id = 20").Scan(&count))
		require.Equal(t, 1, count, "keeper credential row must remain in %s", table)
		require.NoError(t, tx.QueryRowContext(ctx, "SELECT COUNT(*) FROM "+pq.QuoteIdentifier(table)+" WHERE user_id = 30").Scan(&count))
		require.Zero(t, count, "removed user credential row must be deleted from %s", table)
	}

	for _, table := range removedTables {
		var exists bool
		err = tx.QueryRowContext(ctx, `
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = $1 AND table_name = $2
)
`, schema, table).Scan(&exists)
		require.NoError(t, err)
		require.Falsef(t, exists, "removed table %s must not remain", table)
	}

	for table, columns := range map[string][]string{
		"users":                  {"balance", "frozen_balance", "signup_source", "wechat", "rpm_limit"},
		"api_keys":               {"quota", "quota_used", "rate_limit_5h", "usage_5h", "window_5h_start"},
		"groups":                 {"is_exclusive", "subscription_type", "peak_rate_enabled", "allow_batch_image_generation"},
		"usage_logs":             {"subscription_id", "billing_type"},
		"usage_dashboard_hourly": {"active_users"},
		"usage_dashboard_daily":  {"active_users"},
	} {
		for _, column := range columns {
			var exists bool
			err = tx.QueryRowContext(ctx, `
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2 AND column_name = $3
)
`, schema, table, column).Scan(&exists)
			require.NoError(t, err)
			require.Falsef(t, exists, "removed column %s.%s must not remain", table, column)
		}
	}

	_, err = tx.ExecContext(ctx, "SAVEPOINT singleton_guard")
	require.NoError(t, err)
	_, err = tx.ExecContext(ctx, `
INSERT INTO users (id, email, password_hash, role, status)
VALUES (40, 'second@example.test', 'hash-40', 'admin', 'active')
`)
	require.Error(t, err, "singleton index must reject a second administrator")
	_, rollbackErr := tx.ExecContext(ctx, "ROLLBACK TO SAVEPOINT singleton_guard")
	require.NoError(t, rollbackErr)

	_, err = tx.ExecContext(ctx, "SAVEPOINT role_guard")
	require.NoError(t, err)
	_, err = tx.ExecContext(ctx, "UPDATE users SET role = 'user' WHERE id = 20")
	require.Error(t, err, "single administrator role constraint must reject non-admin roles")
	_, rollbackErr = tx.ExecContext(ctx, "ROLLBACK TO SAVEPOINT role_guard")
	require.NoError(t, rollbackErr)
}

func execMigrationSQL(ctx context.Context, tx *sql.Tx, migrationSQL []byte) error {
	_, err := tx.ExecContext(ctx, string(migrationSQL))
	return err
}

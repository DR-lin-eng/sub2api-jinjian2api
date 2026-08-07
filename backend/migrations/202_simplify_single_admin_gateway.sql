-- Collapse existing installations to the single local administrator used by
-- the 2API branch. Gateway API keys and usage history are reassigned to the
-- selected administrator before the remaining user rows are removed.

-- Product surfaces removed from this branch. CASCADE is intentional here: it
-- also removes legacy foreign keys and indexes owned by these tables.
DROP TABLE IF EXISTS
    announcement_reads,
    announcements,
    auth_identity_channels,
    identity_adoption_decisions,
    pending_auth_sessions,
    auth_identities,
    auth_identity_migration_reports,
    batch_image_events,
    batch_image_items,
    batch_image_jobs,
    chat_messages,
    chat_conversations,
    payment_audit_logs,
    payment_orders,
    payment_provider_instances,
    promo_code_usages,
    promo_codes,
    redeem_code_usages,
    redeem_codes,
    billing_usage_entries,
    usage_billing_jobs,
    usage_billing_dead_letters,
    usage_billing_dedup_archive,
    usage_billing_dedup,
    user_subscriptions,
    subscription_plans,
    user_allowed_groups,
    orphan_allowed_groups_audit,
    user_attribute_values,
    user_attribute_definitions,
    user_platform_quotas,
    user_group_rate_multipliers,
    user_provider_default_grants,
    user_affiliate_ledger,
    user_affiliates,
    usage_cleanup_tasks,
    usage_dashboard_hourly_users,
    usage_dashboard_daily_users
CASCADE;

DO $$
DECLARE
    keeper_id BIGINT;
BEGIN
    SELECT id
    INTO keeper_id
    FROM users
    ORDER BY
        CASE
            WHEN deleted_at IS NULL AND status = 'active' AND role = 'admin' THEN 0
            WHEN role = 'admin' THEN 1
            WHEN deleted_at IS NULL THEN 2
            ELSE 3
        END,
        id
    LIMIT 1;

    IF keeper_id IS NOT NULL THEN
        UPDATE users
        SET role = 'admin',
            status = 'active',
            deleted_at = NULL,
            updated_at = NOW()
        WHERE id = keeper_id;

        UPDATE api_keys
        SET user_id = keeper_id
        WHERE user_id <> keeper_id;

        UPDATE usage_logs
        SET user_id = keeper_id
        WHERE user_id <> keeper_id;

        UPDATE channel_monitors
        SET created_by = keeper_id
        WHERE created_by <> keeper_id;

        DELETE FROM users
        WHERE id <> keeper_id;
    END IF;
END
$$;

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'admin',
    DROP COLUMN IF EXISTS balance,
    DROP COLUMN IF EXISTS frozen_balance,
    DROP COLUMN IF EXISTS signup_source,
    DROP COLUMN IF EXISTS wechat,
    DROP COLUMN IF EXISTS balance_notify_enabled,
    DROP COLUMN IF EXISTS balance_notify_threshold_type,
    DROP COLUMN IF EXISTS balance_notify_threshold,
    DROP COLUMN IF EXISTS balance_notify_extra_emails,
    DROP COLUMN IF EXISTS total_recharged,
    DROP COLUMN IF EXISTS rpm_limit;

ALTER TABLE api_keys
    DROP COLUMN IF EXISTS quota,
    DROP COLUMN IF EXISTS quota_used,
    DROP COLUMN IF EXISTS rate_limit_5h,
    DROP COLUMN IF EXISTS rate_limit_1d,
    DROP COLUMN IF EXISTS rate_limit_7d,
    DROP COLUMN IF EXISTS usage_5h,
    DROP COLUMN IF EXISTS usage_1d,
    DROP COLUMN IF EXISTS usage_7d,
    DROP COLUMN IF EXISTS window_5h_start,
    DROP COLUMN IF EXISTS window_1d_start,
    DROP COLUMN IF EXISTS window_7d_start;

ALTER TABLE groups
    DROP COLUMN IF EXISTS peak_rate_enabled,
    DROP COLUMN IF EXISTS peak_start,
    DROP COLUMN IF EXISTS peak_end,
    DROP COLUMN IF EXISTS peak_rate_multiplier,
    DROP COLUMN IF EXISTS is_exclusive,
    DROP COLUMN IF EXISTS subscription_type,
    DROP COLUMN IF EXISTS daily_limit_usd,
    DROP COLUMN IF EXISTS weekly_limit_usd,
    DROP COLUMN IF EXISTS monthly_limit_usd,
    DROP COLUMN IF EXISTS default_validity_days,
    DROP COLUMN IF EXISTS allow_batch_image_generation,
    DROP COLUMN IF EXISTS batch_image_discount_multiplier,
    DROP COLUMN IF EXISTS batch_image_hold_multiplier;

ALTER TABLE usage_logs
    DROP COLUMN IF EXISTS subscription_id,
    DROP COLUMN IF EXISTS billing_type;

ALTER TABLE usage_dashboard_hourly
    DROP COLUMN IF EXISTS active_users;

ALTER TABLE usage_dashboard_daily
    DROP COLUMN IF EXISTS active_users;

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_single_admin_role_check;

ALTER TABLE users
    ADD CONSTRAINT users_single_admin_role_check CHECK (role = 'admin');

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_singleton
    ON users ((1));

-- Keep content moderation as a gateway audit/blocking system. The single-admin
-- branch has no ordinary user account to punish or restore.

UPDATE settings
SET value = (
        value::jsonb
        - 'auto_ban_enabled'
        - 'ban_threshold'
        - 'violation_window_hours'
        - 'cyber_policy_exclude_from_ban_count'
    )::text,
    updated_at = NOW()
WHERE key = 'content_moderation_config'
  AND NULLIF(BTRIM(value), '') IS NOT NULL;

DELETE FROM settings
WHERE key IN (
    'notification_email_template:content_moderation.account_disabled:en',
    'notification_email_template:content_moderation.account_disabled:zh'
)
   OR key LIKE 'notification_email_delivery:content_moderation.account_disabled:%';

ALTER TABLE content_moderation_logs
    DROP COLUMN IF EXISTS violation_count,
    DROP COLUMN IF EXISTS auto_banned;

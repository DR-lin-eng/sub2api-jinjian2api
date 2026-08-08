-- Remove persisted settings owned by product surfaces that do not exist in the
-- single-administrator 2API branch. Keep upstream account billing, quota, and
-- subscription probe settings intact.

DELETE FROM settings
WHERE key IN (
    'registration_enabled',
    'email_verify_enabled',
    'registration_email_suffix_whitelist',
    'promo_code_enabled',
    'password_reset_enabled',
    'invitation_code_enabled',
    'login_agreement_enabled',
    'login_agreement_mode',
    'login_agreement_updated_at',
    'login_agreement_documents',
    'turnstile_enabled',
    'turnstile_site_key',
    'turnstile_secret_key',
    'recaptcha_enabled',
    'recaptcha_site_key',
    'recaptcha_secret_key',
    'cap_enabled',
    'cap_api_endpoint',
    'cap_secret_key',
    'local_captcha_enabled',
    'allow_user_view_error_requests',
    'allow_user_view_usage_details',
    'available_channels_enabled',
    'backend_mode_enabled',
    'balance_low_notify_enabled',
    'balance_low_notify_threshold',
    'balance_low_notify_recharge_url',
    'compact_home_enabled',
    'contact_info',
    'custom_menu_items',
    'default_balance',
    'default_concurrency',
    'default_platform_quotas',
    'default_subscriptions',
    'default_user_rpm_limit',
    'force_email_on_third_party_signup',
    'home_content',
    'model_plaza_enabled',
    'model_plaza_require_auth',
    'model_plaza_auto_public_models',
    'model_plaza_description',
    'purchase_subscription_enabled',
    'purchase_subscription_url',
    'site_subtitle',
    'subscription_expiry_notify_enabled',
    'support_chat_enabled',
    'legacy_auth_source_signup_grant_review',
    'payment_enabled',
    'MIN_RECHARGE_AMOUNT',
    'MAX_RECHARGE_AMOUNT',
    'DAILY_RECHARGE_LIMIT',
    'ORDER_TIMEOUT_MINUTES',
    'MAX_PENDING_ORDERS',
    'ENABLED_PAYMENT_TYPES',
    'LOAD_BALANCE_STRATEGY',
    'BALANCE_PAYMENT_DISABLED',
    'BALANCE_RECHARGE_MULTIPLIER',
    'SUBSCRIPTION_USD_TO_CNY_RATE',
    'RECHARGE_FEE_RATE',
    'PRODUCT_NAME_PREFIX',
    'PRODUCT_NAME_SUFFIX',
    'PAYMENT_HELP_IMAGE_URL',
    'PAYMENT_HELP_TEXT',
    'CANCEL_RATE_LIMIT_ENABLED',
    'CANCEL_RATE_LIMIT_MAX',
    'CANCEL_RATE_LIMIT_WINDOW',
    'CANCEL_RATE_LIMIT_UNIT',
    'CANCEL_RATE_LIMIT_WINDOW_MODE',
    'ALIPAY_FORCE_QRCODE',
    'ALIPAY_MOBILE_PRECREATE_DEEP_LINK',
    'notification_email_unsubscribe_secret'
)
   OR key ~ '^(affiliate_|auth_source_default_|linuxdo_connect_|dingtalk_connect_|wechat_connect_|oidc_connect_|github_oauth_|google_oauth_|aliyun_captcha_|tencent_captcha_|payment_visible_method_)'
   OR key LIKE 'notification_email_preference:%'
   OR key ~ '^notification_email_(template|delivery):(auth\.verify_code|auth\.password_reset|notification_email\.verify_code|subscription\.purchase_success|subscription\.expiry_reminder|balance\.low|balance\.recharge_success|content_moderation\.account_disabled):';

-- Migration 202 leaves only the keeper administrator. Remove locale rows that
-- belonged to users deleted by that migration while preserving the keeper's
-- locale and email-address locale rows used by operational notifications.
DELETE FROM settings AS setting
WHERE setting.key LIKE 'notification_email_locale:user:%'
  AND NOT EXISTS (
      SELECT 1
      FROM users
      WHERE setting.key = 'notification_email_locale:user:' || users.id::text
  );

-- Scoped admin API keys are stored as JSON in settings. Remove the retired
-- user-management scopes without replacing an empty result with admin.read;
-- an empty scope array intentionally remains deny-all.
DO $$
DECLARE
    store JSONB;
    cleaned_keys JSONB;
BEGIN
    SELECT value::jsonb
    INTO store
    FROM settings
    WHERE key = 'admin_api_keys';

    IF NOT FOUND
       OR jsonb_typeof(store) <> 'object'
       OR jsonb_typeof(store -> 'keys') <> 'array' THEN
        RETURN;
    END IF;

    SELECT COALESCE(
        jsonb_agg(cleaned.item ORDER BY cleaned.ordinality),
        '[]'::jsonb
    )
    INTO cleaned_keys
    FROM (
        SELECT
            entry.ordinality,
            CASE
                WHEN jsonb_typeof(entry.item -> 'scopes') = 'array' THEN
                    jsonb_set(
                        entry.item,
                        '{scopes}',
                        COALESCE(
                            (
                                SELECT jsonb_agg(scope.item ORDER BY scope.ordinality)
                                FROM jsonb_array_elements(entry.item -> 'scopes')
                                    WITH ORDINALITY AS scope(item, ordinality)
                                WHERE scope.item NOT IN (
                                    '"admin.users.read"'::jsonb,
                                    '"admin.users.write"'::jsonb
                                )
                            ),
                            '[]'::jsonb
                        ),
                        false
                    )
                ELSE entry.item
            END AS item
        FROM jsonb_array_elements(store -> 'keys')
            WITH ORDINALITY AS entry(item, ordinality)
    ) AS cleaned;

    IF cleaned_keys IS DISTINCT FROM (store -> 'keys') THEN
        UPDATE settings
        SET value = jsonb_set(store, '{keys}', cleaned_keys, false)::text,
            updated_at = NOW()
        WHERE key = 'admin_api_keys';
    END IF;
EXCEPTION
    WHEN invalid_text_representation THEN
        -- Leave malformed legacy data untouched so it cannot block upgrades.
        NULL;
END
$$;

import { describe, expect, it, vi } from "vitest";
import { createSettingsForm } from "@/features/admin-settings/presentation/composables/settingsForm";
import { buildSettingsSavePayload } from "@/features/admin-settings/presentation/composables/settingsSavePayload";
import { prepareSettingsSave } from "@/features/admin-settings/presentation/composables/settingsSavePreparation";

describe("settings save preparation", () => {
  it("stops before parsing later fields when the default page size is invalid", () => {
    const form = createSettingsForm();
    form.table_default_page_size = 4;
    const parseTablePageSizeOptionsInput = vi.fn(() => [10, 20]);
    const serializeClaudeOAuthSystemPromptBlocks = vi.fn(() => "[]");

    expect(
      prepareSettingsSave({
        form,
        tablePageSizeOptionsInput: "10, 20",
        parseTablePageSizeOptionsInput,
        serializeClaudeOAuthSystemPromptBlocks,
      }),
    ).toEqual({
      ok: false,
      error: { kind: "tableDefaultPageSize" },
    });
    expect(parseTablePageSizeOptionsInput).not.toHaveBeenCalled();
    expect(serializeClaudeOAuthSystemPromptBlocks).not.toHaveBeenCalled();
  });

  it("validates page-size options before serializing prompt blocks", () => {
    const form = createSettingsForm();
    const serializeClaudeOAuthSystemPromptBlocks = vi.fn(() => "[]");

    expect(
      prepareSettingsSave({
        form,
        tablePageSizeOptionsInput: "invalid",
        parseTablePageSizeOptionsInput: vi.fn(() => null),
        serializeClaudeOAuthSystemPromptBlocks,
      }),
    ).toEqual({
      ok: false,
      error: { kind: "tablePageSizeOptions" },
    });
    expect(serializeClaudeOAuthSystemPromptBlocks).not.toHaveBeenCalled();
  });

  it("normalizes table settings and serializes the Claude prompt blocks", () => {
    const form = createSettingsForm();
    form.table_default_page_size = 25.9;

    expect(
      prepareSettingsSave({
        form,
        tablePageSizeOptionsInput: "10, 25",
        parseTablePageSizeOptionsInput: vi.fn(() => [10, 25]),
        serializeClaudeOAuthSystemPromptBlocks: vi.fn(
          () => '[{"type":"text","text":"system"}]',
        ),
      }),
    ).toEqual({
      ok: true,
      claudeOAuthSystemPromptBlocksJSON:
        '[{"type":"text","text":"system"}]',
    });
    expect(form.table_default_page_size).toBe(25);
    expect(form.table_page_size_options).toEqual([10, 25]);
    expect(form.claude_oauth_system_prompt_blocks).toBe(
      '[{"type":"text","text":"system"}]',
    );
  });
});

function buildPayload(overrides: {
  openaiFastPolicyLoaded?: boolean;
  openaiFastPolicyRules?: Parameters<
    typeof buildSettingsSavePayload
  >[0]["openaiFastPolicyRules"];
} = {}) {
  const form = createSettingsForm();
  form.site_name = "Gateway";
  form.smtp_password = "secret";
  form.api_key_acl_trust_forwarded_ip = false;
  form.account_quota_notify_emails = [
    { email: "ops@example.com", disabled: false, verified: true },
    { email: "  ", disabled: false, verified: true },
  ];

  return buildSettingsSavePayload({
    form,
    clientIPTrustedProxies: ["10.0.0.0/8"],
    claudeOAuthSystemPromptBlocksJSON: "[]",
    codexFingerprintSignalsJSON: '[{"type":"header_exact"}]',
    codexBlacklistJSON: '[{"originator":"legacy"}]',
    codexWhitelistJSON: '[{"originator":"allowed"}]',
    openaiFastPolicyLoaded: overrides.openaiFastPolicyLoaded ?? false,
    openaiFastPolicyRules: overrides.openaiFastPolicyRules ?? [],
  });
}

describe("settings save payload", () => {
  it("sends the active single-admin gateway contract only", () => {
    const payload = buildPayload();

    expect(payload).toMatchObject({
      site_name: "Gateway",
      smtp_password: "secret",
      api_key_acl_trust_forwarded_ip: false,
      client_ip_trusted_proxies: ["10.0.0.0/8"],
      account_quota_notify_emails: [
        { email: "ops@example.com", disabled: false, verified: true },
      ],
      codex_cli_only_engine_fingerprint_signals:
        '[{"type":"header_exact"}]',
      codex_cli_only_blacklist: '[{"originator":"legacy"}]',
      codex_cli_only_whitelist: '[{"originator":"allowed"}]',
    });
    expect(payload).not.toHaveProperty("registration_enabled");
    expect(payload).not.toHaveProperty("default_concurrency");
    expect(payload).not.toHaveProperty("default_subscriptions");
    expect(payload).not.toHaveProperty("default_platform_quotas");
    expect(payload).not.toHaveProperty("payment_enabled");
    expect(payload).not.toHaveProperty("balance_low_notify_enabled");
    expect(payload).not.toHaveProperty("model_plaza_enabled");
    expect(payload).not.toHaveProperty("openai_fast_policy_settings");
  });

  it("normalizes fast-policy rules only after that contract was loaded", () => {
    const payload = buildPayload({
      openaiFastPolicyLoaded: true,
      openaiFastPolicyRules: [
        {
          service_tier: "priority",
          action: "block",
          scope: "oauth",
          error_message: "blocked",
          model_whitelist: [" gpt-5* ", ""],
          fallback_action: "block",
          fallback_error_message: "fallback blocked",
        },
      ],
    });

    expect(payload.openai_fast_policy_settings).toEqual({
      rules: [
        {
          service_tier: "priority",
          action: "block",
          scope: "oauth",
          error_message: "blocked",
          model_whitelist: ["gpt-5*"],
          fallback_action: "block",
          fallback_error_message: "fallback blocked",
        },
      ],
    });
    expect(payload.openai_fast_policy_settings?.rules[0]).not.toHaveProperty(
      "user_ids",
    );
  });
});

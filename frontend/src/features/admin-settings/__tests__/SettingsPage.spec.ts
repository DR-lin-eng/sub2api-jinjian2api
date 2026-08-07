import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(featureDir, relativePath), "utf8");

describe("single-admin settings page", () => {
  const pageSource = readFeatureSource("presentation/pages/SettingsPage.vue");
  const pageStateSource = readFeatureSource(
    "presentation/composables/useSettingsPage.ts",
  );
  const securitySource = readFeatureSource(
    "presentation/widgets/settings-tabs/SettingsSecurityTab.vue",
  );
  const emailSource = readFeatureSource(
    "presentation/widgets/settings-tabs/SettingsEmailTab.vue",
  );
  const forwardingSource = readFeatureSource(
    "presentation/widgets/settings-tabs/SettingsGatewayForwardingPanel.vue",
  );
  const formSource = readFeatureSource(
    "presentation/composables/settingsForm.ts",
  );

  it("exposes only the six gateway administration tabs", () => {
    for (const tab of [
      "general",
      "security",
      "gateway",
      "performance",
      "email",
      "backup",
    ]) {
      expect(pageStateSource).toContain(`key: "${tab}" as SettingsTab`);
      expect(pageSource).toContain(`activeTab === '${tab}'`);
    }
    expect(pageStateSource).not.toMatch(/key: "(?:users|payment|features)"/);
  });

  it("keeps local admin security and API-key IP controls", () => {
    expect(securitySource).toContain("SettingsSecurityApiKeysPanel");
    expect(securitySource).toContain("SettingsLiteSecurityAccessPanel");
    expect(securitySource).not.toContain("IdentityProviders");
    expect(pageStateSource).toContain("useSettingsClientIPAccess");
    expect(pageStateSource).not.toContain("useSettingsIdentityAccess");
    expect(pageStateSource).not.toContain("useSettingsRegistrationDefaults");
  });

  it("keeps operational SMTP and upstream quota notifications only", () => {
    expect(emailSource).toContain("form.smtp_host");
    expect(emailSource).toContain("testSmtpConnection");
    expect(emailSource).toContain("sendTestEmail");
    expect(emailSource).toContain("form.account_quota_notify_enabled");
    expect(emailSource).toContain("EmailTemplateEditor");
    expect(emailSource).not.toContain("email_verify_enabled");
    expect(emailSource).not.toContain("subscription_expiry_notify");
    expect(emailSource).not.toContain("balance_low_notify");
  });

  it("does not expose downstream-user usage visibility controls", () => {
    expect(forwardingSource).not.toContain("allow_user_view_usage_details");
    expect(forwardingSource).not.toContain("allow_user_view_error_requests");
    expect(forwardingSource).not.toContain("usageRecords");
  });

  it("does not initialize removed registration, payment, or subscription state", () => {
    for (const field of [
      "registration_enabled",
      "default_balance",
      "default_concurrency",
      "default_subscriptions",
      "payment_enabled",
      "balance_low_notify_enabled",
      "model_plaza_enabled",
    ]) {
      expect(formSource).not.toContain(field);
    }
  });
});

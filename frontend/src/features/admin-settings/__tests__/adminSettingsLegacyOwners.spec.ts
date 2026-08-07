import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontendSrcDir = resolve(featureDir, "../..");
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(featureDir, relativePath), "utf8");

describe("admin settings explicit runtime owners", () => {
  const storeSource = readFeatureSource(
    "presentation/stores/adminSettingsStore.ts",
  );
  const errorDialogSource = readFeatureSource(
    "presentation/widgets/ErrorPassthroughRulesDialog.vue",
  );
  const tlsDialogSource = readFeatureSource(
    "presentation/widgets/TLSFingerprintProfilesDialog.vue",
  );
  const complianceDialogSource = readFeatureSource(
    "presentation/widgets/AdminComplianceDialog.vue",
  );
  const appSource = readFileSync(resolve(frontendSrcDir, "App.vue"), "utf8");

  it("loads shared settings state from the explicit settings owner", () => {
    expect(storeSource).toContain(
      "features/admin-settings/data/datasources/adminSystemSettingsQueries",
    );
    expect(storeSource).not.toContain("adminPaymentDatasource");
    expect(storeSource).not.toContain("from '@/api'");
  });

  it("routes existing settings widgets through their datasource owners", () => {
    expect(errorDialogSource).toContain(
      "data/datasources/errorPassthroughDatasource",
    );
    expect(tlsDialogSource).toContain(
      "data/datasources/tlsFingerprintProfileDatasource",
    );
    for (const source of [errorDialogSource, tlsDialogSource]) {
      expect(source).not.toContain("from '@/api/admin'");
      expect(source).not.toContain('from "@/api/admin"');
    }
  });

  it("keeps authentication and logout orchestration at the app boundary", () => {
    expect(complianceDialogSource).toContain(
      "presentation/stores/adminComplianceStore",
    );
    expect(complianceDialogSource).toContain("@/core/stores/appStore");
    expect(complianceDialogSource).not.toContain("from '@/stores'");
    expect(complianceDialogSource).not.toContain(
      "features/auth/presentation/stores/authStore",
    );
    expect(appSource).toContain(
      ':is-authenticated="authStore.isAuthenticated"',
    );
    expect(appSource).toContain(':is-admin="authStore.isAdmin"');
    expect(appSource).toContain('@logout="logoutForAdminCompliance"');
  });
});

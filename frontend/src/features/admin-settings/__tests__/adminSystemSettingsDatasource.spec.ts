import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, put } = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/core/networks/client", () => ({
  apiClient: { get, put },
}));

import { updateSettings } from "@/features/admin-settings/data/datasources/adminSystemSettingsActions";
import { getSettings } from "@/features/admin-settings/data/datasources/adminSystemSettingsQueries";
import {
  getSettings as getSettingsFromFacade,
  settingsAPI,
  updateSettings as updateSettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type { UpdateSettingsRequest } from "@/features/admin-settings/data/dtos/adminSystemSettingsDtos";

describe("admin system settings datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it("keeps the complete settings read on the query owner", async () => {
    const response = {
      site_name: "Sub2API",
      account_quota_notify_enabled: false,
    };
    get.mockResolvedValueOnce({ data: response });

    await expect(getSettings()).resolves.toEqual(response);
    expect(get).toHaveBeenCalledWith("/admin/settings");
  });

  it("preserves the partial update payload and applied response", async () => {
    const payload: UpdateSettingsRequest = {
      site_name: "Updated",
      step_up_enabled: true,
    };
    const response = { ...payload, account_quota_notify_enabled: false };
    put.mockResolvedValueOnce({ data: response });

    await expect(updateSettings(payload)).resolves.toEqual(response);
    expect(put).toHaveBeenCalledWith("/admin/settings", payload);
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getSettingsFromFacade).toBe(getSettings);
    expect(updateSettingsFromFacade).toBe(updateSettings);
    expect(settingsAPI.getSettings).toBe(getSettings);
    expect(settingsAPI.updateSettings).toBe(updateSettings);
  });
});

describe("admin system settings ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminSystemSettingsDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminSystemSettingsQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminSystemSettingsActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );

  it("owns the main settings contracts outside the compatibility datasource", () => {
    for (const dtoName of [
      "SystemSettings",
      "ClientIPResolutionStatus",
      "OpenAIFastPolicyRule",
      "OpenAIFastPolicySettings",
    ]) {
      expect(dtoSource, dtoName).toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
      expect(compatibilitySource, dtoName).not.toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
    }
    expect(dtoSource).toContain("export type UpdateSettingsRequest");
    expect(dtoSource).not.toContain("DefaultSubscriptionSetting");
    expect(dtoSource).not.toContain("apiClient");
    expect(compatibilitySource).toContain(
      'from "../dtos/adminSystemSettingsDtos"',
    );
  });

  it("keeps query and action owners aligned to the original endpoint", () => {
    expect(querySource).toContain('apiClient.get<SystemSettings>("/admin/settings")');
    expect(actionSource).toContain('"/admin/settings"');
    expect(actionSource).toContain("settings,");
    expect(compatibilitySource).not.toMatch(
      /export async function (getSettings|updateSettings)\b/,
    );
  });

  it("routes the main consumers through the explicit owners", () => {
    const pageSource = readFeatureSource(
      "presentation/composables/useSettingsPage.ts",
    );
    const storeSource = readFeatureSource(
      "presentation/stores/adminSettingsStore.ts",
    );
    const quotaNotifySource = readFeatureSource(
      "../admin-accounts/presentation/composables/useQuotaNotifyState.ts",
    );

    expect(pageSource).toContain("adminSystemSettingsQueries");
    expect(pageSource).toContain("adminSystemSettingsActions");
    expect(pageSource).not.toContain("settingsAPI.getSettings");
    expect(pageSource).not.toContain("settingsAPI.updateSettings");
    expect(storeSource).toContain("adminSystemSettingsQueries");
    expect(quotaNotifySource).toContain("adminSystemSettingsQueries");
  });
});

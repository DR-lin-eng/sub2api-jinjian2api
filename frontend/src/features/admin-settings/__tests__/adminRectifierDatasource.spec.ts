import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, put, showError, showSuccess } = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

vi.mock("@/core/networks/client", () => ({
  apiClient: { get, put },
}));

vi.mock("@/core/stores/appStore", () => ({
  useAppStore: () => ({ showError, showSuccess }),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

import { updateRectifierSettings } from "@/features/admin-settings/data/datasources/adminRectifierActions";
import { getRectifierSettings } from "@/features/admin-settings/data/datasources/adminRectifierQueries";
import {
  getRectifierSettings as getRectifierSettingsFromFacade,
  settingsAPI,
  updateRectifierSettings as updateRectifierSettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type { RectifierSettings } from "@/features/admin-settings/data/dtos/adminRectifierDtos";
import { useSettingsGatewayPolicies } from "@/features/admin-settings/presentation/composables/useSettingsGatewayPolicies";

const settings: RectifierSettings = {
  enabled: true,
  thinking_signature_enabled: true,
  thinking_budget_enabled: true,
  thinking_display_mode: "display_only",
  apikey_signature_enabled: true,
  apikey_signature_patterns: ["sk-ant-*", "sk-admin-*"],
};

describe("admin rectifier datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    showError.mockReset();
    showSuccess.mockReset();
  });

  it("reads the complete settings response from the existing endpoint", async () => {
    get.mockResolvedValueOnce({ data: settings });

    await expect(getRectifierSettings()).resolves.toEqual(settings);
    expect(get).toHaveBeenCalledWith("/admin/settings/rectifier");
  });

  it("updates the existing endpoint with every rectifier field", async () => {
    const response = { ...settings, thinking_display_mode: "force" as const };
    put.mockResolvedValueOnce({ data: response });

    await expect(updateRectifierSettings(settings)).resolves.toEqual(response);
    expect(put).toHaveBeenCalledWith("/admin/settings/rectifier", settings);
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getRectifierSettingsFromFacade).toBe(getRectifierSettings);
    expect(updateRectifierSettingsFromFacade).toBe(updateRectifierSettings);
    expect(settingsAPI.getRectifierSettings).toBe(getRectifierSettings);
    expect(settingsAPI.updateRectifierSettings).toBe(updateRectifierSettings);
  });
});

describe("rectifier settings controller", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    showError.mockReset();
    showSuccess.mockReset();
  });

  it("normalizes null legacy patterns after loading", async () => {
    get.mockResolvedValueOnce({
      data: { ...settings, apikey_signature_patterns: null },
    });
    const policies = useSettingsGatewayPolicies();

    await policies.loadRectifierSettings();

    expect(policies.rectifierForm.apikey_signature_patterns).toEqual([]);
    expect(policies.rectifierLoading.value).toBe(false);
    expect(showError).not.toHaveBeenCalled();
  });

  it("keeps defaults when the optional load fails silently", async () => {
    get.mockRejectedValueOnce(new Error("unavailable"));
    const policies = useSettingsGatewayPolicies();

    await policies.loadRectifierSettings();

    expect(policies.rectifierForm).toMatchObject({
      enabled: true,
      thinking_signature_enabled: true,
      thinking_budget_enabled: true,
      thinking_display_mode: "display_only",
      apikey_signature_enabled: false,
      apikey_signature_patterns: [],
    });
    expect(policies.rectifierLoading.value).toBe(false);
    expect(showError).not.toHaveBeenCalled();
  });

  it("filters empty patterns, assigns the response, and reports success", async () => {
    put.mockResolvedValueOnce({
      data: {
        ...settings,
        enabled: false,
        apikey_signature_patterns: null,
      },
    });
    const policies = useSettingsGatewayPolicies();
    Object.assign(policies.rectifierForm, {
      ...settings,
      apikey_signature_patterns: ["sk-ant-*", "", "   ", " sk-admin-* "],
    });

    await policies.saveRectifierSettings();

    expect(put).toHaveBeenCalledWith("/admin/settings/rectifier", {
      ...settings,
      apikey_signature_patterns: ["sk-ant-*", " sk-admin-* "],
    });
    expect(policies.rectifierForm.enabled).toBe(false);
    expect(policies.rectifierForm.apikey_signature_patterns).toEqual([]);
    expect(policies.rectifierSaving.value).toBe(false);
    expect(showSuccess).toHaveBeenCalledWith("admin.settings.rectifier.saved");
  });
});

describe("admin rectifier ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminRectifierDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminRectifierQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminRectifierActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const composableSource = readFeatureSource(
    "presentation/composables/useSettingsGatewayPolicies.ts",
  );

  it("owns the protocol and requests outside the compatibility datasource", () => {
    expect(dtoSource).toMatch(/export type ThinkingDisplayMode\b/);
    expect(dtoSource).toMatch(/export interface RectifierSettings\b/);
    expect(dtoSource).not.toContain("apiClient");
    expect(querySource).toMatch(/export async function getRectifierSettings\b/);
    expect(actionSource).toMatch(
      /export async function updateRectifierSettings\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export type ThinkingDisplayMode\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export interface RectifierSettings\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export async function (?:get|update)RectifierSettings\b/,
    );
    expect(composableSource).toContain("adminRectifierQueries");
    expect(composableSource).toContain("adminRectifierActions");
    expect(composableSource).not.toContain("settingsAPI.getRectifierSettings");
    expect(composableSource).not.toContain(
      "settingsAPI.updateRectifierSettings",
    );
    expect(composableSource).not.toContain("import(");
  });
});

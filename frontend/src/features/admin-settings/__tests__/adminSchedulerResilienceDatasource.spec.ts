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

import {
  updateGlobalTempUnschedulableSettings,
  updateOverloadCooldownSettings,
  updateRateLimit429CooldownSettings,
} from "@/features/admin-settings/data/datasources/adminSchedulerResilienceActions";
import {
  getGlobalTempUnschedulableSettings,
  getOverloadCooldownSettings,
  getRateLimit429CooldownSettings,
} from "@/features/admin-settings/data/datasources/adminSchedulerResilienceQueries";
import {
  getGlobalTempUnschedulableSettings as getGlobalTempUnschedulableSettingsFromFacade,
  getOverloadCooldownSettings as getOverloadCooldownSettingsFromFacade,
  getRateLimit429CooldownSettings as getRateLimit429CooldownSettingsFromFacade,
  settingsAPI,
  updateGlobalTempUnschedulableSettings as updateGlobalTempUnschedulableSettingsFromFacade,
  updateOverloadCooldownSettings as updateOverloadCooldownSettingsFromFacade,
  updateRateLimit429CooldownSettings as updateRateLimit429CooldownSettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type {
  GlobalTempUnschedulableSettings,
  OverloadCooldownSettings,
  RateLimit429CooldownSettings,
} from "@/features/admin-settings/data/dtos/adminSchedulerResilienceDtos";

const overloadSettings: OverloadCooldownSettings = {
  enabled: true,
  cooldown_minutes: 10,
};
const rateLimitSettings: RateLimit429CooldownSettings = {
  enabled: true,
  cooldown_seconds: 5,
};
const tempUnschedulableSettings: GlobalTempUnschedulableSettings = {
  enabled: false,
};

describe("admin scheduler resilience datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it("reads overload cooldown settings from the existing endpoint", async () => {
    get.mockResolvedValueOnce({ data: overloadSettings });

    await expect(getOverloadCooldownSettings()).resolves.toEqual(overloadSettings);
    expect(get).toHaveBeenCalledWith("/admin/settings/overload-cooldown");
  });

  it("updates overload cooldown settings with the complete payload", async () => {
    put.mockResolvedValueOnce({ data: overloadSettings });

    await expect(updateOverloadCooldownSettings(overloadSettings)).resolves.toEqual(
      overloadSettings,
    );
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/overload-cooldown",
      overloadSettings,
    );
  });

  it("reads 429 cooldown settings from the existing endpoint", async () => {
    get.mockResolvedValueOnce({ data: rateLimitSettings });

    await expect(getRateLimit429CooldownSettings()).resolves.toEqual(rateLimitSettings);
    expect(get).toHaveBeenCalledWith(
      "/admin/settings/rate-limit-429-cooldown",
    );
  });

  it("updates 429 cooldown settings with the complete payload", async () => {
    put.mockResolvedValueOnce({ data: rateLimitSettings });

    await expect(
      updateRateLimit429CooldownSettings(rateLimitSettings),
    ).resolves.toEqual(rateLimitSettings);
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/rate-limit-429-cooldown",
      rateLimitSettings,
    );
  });

  it("reads the global temporary unschedulable switch", async () => {
    get.mockResolvedValueOnce({ data: tempUnschedulableSettings });

    await expect(getGlobalTempUnschedulableSettings()).resolves.toEqual(
      tempUnschedulableSettings,
    );
    expect(get).toHaveBeenCalledWith("/admin/settings/temp-unschedulable");
  });

  it("updates the global temporary unschedulable switch", async () => {
    put.mockResolvedValueOnce({ data: tempUnschedulableSettings });

    await expect(
      updateGlobalTempUnschedulableSettings(tempUnschedulableSettings),
    ).resolves.toEqual(tempUnschedulableSettings);
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/temp-unschedulable",
      tempUnschedulableSettings,
    );
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getOverloadCooldownSettingsFromFacade).toBe(
      getOverloadCooldownSettings,
    );
    expect(updateOverloadCooldownSettingsFromFacade).toBe(
      updateOverloadCooldownSettings,
    );
    expect(getRateLimit429CooldownSettingsFromFacade).toBe(
      getRateLimit429CooldownSettings,
    );
    expect(updateRateLimit429CooldownSettingsFromFacade).toBe(
      updateRateLimit429CooldownSettings,
    );
    expect(getGlobalTempUnschedulableSettingsFromFacade).toBe(
      getGlobalTempUnschedulableSettings,
    );
    expect(updateGlobalTempUnschedulableSettingsFromFacade).toBe(
      updateGlobalTempUnschedulableSettings,
    );

    expect(settingsAPI.getOverloadCooldownSettings).toBe(
      getOverloadCooldownSettings,
    );
    expect(settingsAPI.updateOverloadCooldownSettings).toBe(
      updateOverloadCooldownSettings,
    );
    expect(settingsAPI.getRateLimit429CooldownSettings).toBe(
      getRateLimit429CooldownSettings,
    );
    expect(settingsAPI.updateRateLimit429CooldownSettings).toBe(
      updateRateLimit429CooldownSettings,
    );
    expect(settingsAPI.getGlobalTempUnschedulableSettings).toBe(
      getGlobalTempUnschedulableSettings,
    );
    expect(settingsAPI.updateGlobalTempUnschedulableSettings).toBe(
      updateGlobalTempUnschedulableSettings,
    );
  });
});

describe("admin scheduler resilience ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource(
    "data/dtos/adminSchedulerResilienceDtos.ts",
  );
  const querySource = readFeatureSource(
    "data/datasources/adminSchedulerResilienceQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminSchedulerResilienceActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const composableSource = readFeatureSource(
    "presentation/composables/useSettingsGatewayPolicies.ts",
  );

  it("owns protocols and requests outside the compatibility datasource", () => {
    for (const dtoName of [
      "OverloadCooldownSettings",
      "RateLimit429CooldownSettings",
      "GlobalTempUnschedulableSettings",
    ]) {
      expect(dtoSource, dtoName).toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
      expect(compatibilitySource, dtoName).not.toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
    }

    for (const functionName of [
      "getOverloadCooldownSettings",
      "getRateLimit429CooldownSettings",
      "getGlobalTempUnschedulableSettings",
    ]) {
      expect(querySource).toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(compatibilitySource).not.toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(composableSource).not.toContain(`settingsAPI.${functionName}`);
    }

    for (const functionName of [
      "updateOverloadCooldownSettings",
      "updateRateLimit429CooldownSettings",
      "updateGlobalTempUnschedulableSettings",
    ]) {
      expect(actionSource).toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(compatibilitySource).not.toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(composableSource).not.toContain(`settingsAPI.${functionName}`);
    }

    expect(dtoSource).not.toContain("apiClient");
    expect(composableSource).toContain("adminSchedulerResilienceQueries");
    expect(composableSource).toContain("adminSchedulerResilienceActions");
    expect(composableSource).not.toContain("import(");
  });
});

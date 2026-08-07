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

import { updateStreamTimeoutSettings } from "@/features/admin-settings/data/datasources/adminStreamTimeoutActions";
import { getStreamTimeoutSettings } from "@/features/admin-settings/data/datasources/adminStreamTimeoutQueries";
import {
  getStreamTimeoutSettings as getStreamTimeoutSettingsFromFacade,
  settingsAPI,
  updateStreamTimeoutSettings as updateStreamTimeoutSettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type { StreamTimeoutSettings } from "@/features/admin-settings/data/dtos/adminStreamTimeoutDtos";

const settings: StreamTimeoutSettings = {
  response_header_timeout_degradation_enabled: true,
  response_header_timeout_seconds: 20,
  enabled: true,
  action: "temp_unsched",
  temp_unsched_minutes: 5,
  threshold_count: 3,
  threshold_window_minutes: 10,
};

describe("admin stream timeout datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it("reads the complete settings response from the existing endpoint", async () => {
    get.mockResolvedValueOnce({ data: settings });

    await expect(getStreamTimeoutSettings()).resolves.toEqual(settings);
    expect(get).toHaveBeenCalledWith("/admin/settings/stream-timeout");
  });

  it("updates the existing endpoint with every timeout policy field", async () => {
    const response = { ...settings, action: "error" as const };
    put.mockResolvedValueOnce({ data: response });

    await expect(updateStreamTimeoutSettings(settings)).resolves.toEqual(
      response,
    );
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/stream-timeout",
      settings,
    );
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getStreamTimeoutSettingsFromFacade).toBe(getStreamTimeoutSettings);
    expect(updateStreamTimeoutSettingsFromFacade).toBe(
      updateStreamTimeoutSettings,
    );
    expect(settingsAPI.getStreamTimeoutSettings).toBe(
      getStreamTimeoutSettings,
    );
    expect(settingsAPI.updateStreamTimeoutSettings).toBe(
      updateStreamTimeoutSettings,
    );
  });
});

describe("admin stream timeout ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminStreamTimeoutDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminStreamTimeoutQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminStreamTimeoutActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const composableSource = readFeatureSource(
    "presentation/composables/useSettingsGatewayPolicies.ts",
  );

  it("owns the protocol and requests outside the compatibility datasource", () => {
    expect(dtoSource).toMatch(/export interface StreamTimeoutSettings\b/);
    expect(dtoSource).not.toContain("apiClient");
    expect(querySource).toMatch(
      /export async function getStreamTimeoutSettings\b/,
    );
    expect(actionSource).toMatch(
      /export async function updateStreamTimeoutSettings\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export interface StreamTimeoutSettings\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export async function (?:get|update)StreamTimeoutSettings\b/,
    );
    expect(composableSource).toContain("adminStreamTimeoutQueries");
    expect(composableSource).toContain("adminStreamTimeoutActions");
    expect(composableSource).not.toContain(
      "settingsAPI.getStreamTimeoutSettings",
    );
    expect(composableSource).not.toContain(
      "settingsAPI.updateStreamTimeoutSettings",
    );
    expect(composableSource).not.toContain("import(");
  });
});

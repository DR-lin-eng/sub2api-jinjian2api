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

import { updatePanelRateLimitSettings } from "@/features/admin-settings/data/datasources/adminPanelRateLimitActions";
import { getPanelRateLimitSettings } from "@/features/admin-settings/data/datasources/adminPanelRateLimitQueries";
import {
  getPanelRateLimitSettings as getPanelRateLimitSettingsFromFacade,
  settingsAPI,
  updatePanelRateLimitSettings as updatePanelRateLimitSettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import {
  DEFAULT_PANEL_RATE_LIMIT_SETTINGS,
  normalizePanelRateLimitSettings,
} from "@/features/admin-settings/data/dtos/adminPanelRateLimitDtos";

describe("admin panel rate limit datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it("normalizes partial rolling-upgrade responses on the query owner", async () => {
    get.mockResolvedValueOnce({
      data: {
        enabled: true,
        user_rpm: 120,
        heavy_rpm: -1,
        exempt_admin: null,
        public_ip_rpm: 0,
      },
    });

    await expect(getPanelRateLimitSettings()).resolves.toEqual({
      enabled: true,
      user_rpm: 120,
      heavy_rpm: 60,
      exempt_admin: true,
      public_ip_rpm: 0,
    });
    expect(get).toHaveBeenCalledWith("/admin/settings/panel-rate-limit");
  });

  it("preserves the update payload and normalizes a null response", async () => {
    const payload = {
      enabled: false,
      user_rpm: 180,
      heavy_rpm: 45,
      exempt_admin: false,
      public_ip_rpm: 250,
    };
    put.mockResolvedValueOnce({ data: null });

    await expect(updatePanelRateLimitSettings(payload)).resolves.toEqual(
      DEFAULT_PANEL_RATE_LIMIT_SETTINGS,
    );
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/panel-rate-limit",
      payload,
    );
  });

  it("keeps zero and the documented maximum while rejecting invalid rates", () => {
    expect(
      normalizePanelRateLimitSettings({
        enabled: true,
        user_rpm: 0,
        heavy_rpm: 100000,
        exempt_admin: false,
        public_ip_rpm: 100001,
      }),
    ).toEqual({
      enabled: true,
      user_rpm: 0,
      heavy_rpm: 100000,
      exempt_admin: false,
      public_ip_rpm: 300,
    });
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getPanelRateLimitSettingsFromFacade).toBe(
      getPanelRateLimitSettings,
    );
    expect(updatePanelRateLimitSettingsFromFacade).toBe(
      updatePanelRateLimitSettings,
    );
    expect(settingsAPI.getPanelRateLimitSettings).toBe(
      getPanelRateLimitSettings,
    );
    expect(settingsAPI.updatePanelRateLimitSettings).toBe(
      updatePanelRateLimitSettings,
    );
  });
});

describe("admin panel rate limit ownership", () => {
  const featureDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource(
    "data/dtos/adminPanelRateLimitDtos.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const cardSource = readFeatureSource(
    "presentation/widgets/PanelRateLimitSettingsCard.vue",
  );

  it("owns the DTO and card requests outside compatibility barrels", () => {
    expect(dtoSource).toMatch(/export interface PanelRateLimitSettings\b/);
    expect(compatibilitySource).not.toMatch(
      /export interface PanelRateLimitSettings\b/,
    );
    expect(compatibilitySource).toContain(
      'from "../dtos/adminPanelRateLimitDtos"',
    );
    expect(cardSource).toContain(
      "data/datasources/adminPanelRateLimitQueries",
    );
    expect(cardSource).toContain(
      "data/datasources/adminPanelRateLimitActions",
    );
    expect(cardSource).toContain("data/dtos/adminPanelRateLimitDtos");
    expect(cardSource).toContain("@/core/stores/appStore");
    expect(cardSource).not.toContain("adminAPI.settings");
    expect(cardSource).not.toContain("from '@/api'");
    expect(cardSource).not.toContain("from '@/stores'");
  });
});

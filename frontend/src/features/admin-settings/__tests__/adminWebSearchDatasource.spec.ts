import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post, put } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/core/networks/client", () => ({
  apiClient: { get, post, put },
}));

import {
  resetWebSearchUsage,
  testWebSearchEmulation,
  updateWebSearchEmulationConfig,
} from "@/features/admin-settings/data/datasources/adminWebSearchActions";
import { getWebSearchEmulationConfig } from "@/features/admin-settings/data/datasources/adminWebSearchQueries";
import {
  getWebSearchEmulationConfig as getWebSearchEmulationConfigFromFacade,
  resetWebSearchUsage as resetWebSearchUsageFromFacade,
  settingsAPI,
  testWebSearchEmulation as testWebSearchEmulationFromFacade,
  updateWebSearchEmulationConfig as updateWebSearchEmulationConfigFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type {
  ResetWebSearchUsageRequest,
  WebSearchEmulationConfig,
  WebSearchTestResult,
} from "@/features/admin-settings/data/dtos/adminWebSearchDtos";

const config: WebSearchEmulationConfig = {
  enabled: true,
  providers: [
    {
      type: "brave",
      api_key: "",
      api_key_configured: true,
      quota_limit: 1000,
      subscribed_at: 1_754_438_400,
      quota_used: 12,
      proxy_id: 7,
      expires_at: null,
    },
  ],
};

describe("admin Web Search datasource", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
    put.mockReset();
  });

  it("keeps the config read on the query owner", async () => {
    get.mockResolvedValueOnce({ data: config });

    await expect(getWebSearchEmulationConfig()).resolves.toEqual(config);
    expect(get).toHaveBeenCalledWith(
      "/admin/settings/web-search-emulation",
    );
  });

  it("preserves the complete config update payload and response", async () => {
    const response = { ...config, enabled: false };
    put.mockResolvedValueOnce({ data: response });

    await expect(updateWebSearchEmulationConfig(config)).resolves.toEqual(
      response,
    );
    expect(put).toHaveBeenCalledWith(
      "/admin/settings/web-search-emulation",
      config,
    );
  });

  it("preserves the provider test query payload and result", async () => {
    const response: WebSearchTestResult = {
      provider: "brave",
      query: "latest release",
      results: [
        {
          url: "https://example.com/release",
          title: "Release",
          snippet: "Current release notes",
          page_age: "1 day",
        },
      ],
    };
    post.mockResolvedValueOnce({ data: response });

    await expect(testWebSearchEmulation(response.query)).resolves.toEqual(
      response,
    );
    expect(post).toHaveBeenCalledWith(
      "/admin/settings/web-search-emulation/test",
      { query: response.query },
    );
  });

  it("preserves the usage reset payload and void response", async () => {
    const payload: ResetWebSearchUsageRequest = { provider_type: "tavily" };
    post.mockResolvedValueOnce({ data: { message: "reset" } });

    await expect(resetWebSearchUsage(payload)).resolves.toBeUndefined();
    expect(post).toHaveBeenCalledWith(
      "/admin/settings/web-search-emulation/reset-usage",
      payload,
    );
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getWebSearchEmulationConfigFromFacade).toBe(
      getWebSearchEmulationConfig,
    );
    expect(updateWebSearchEmulationConfigFromFacade).toBe(
      updateWebSearchEmulationConfig,
    );
    expect(testWebSearchEmulationFromFacade).toBe(testWebSearchEmulation);
    expect(resetWebSearchUsageFromFacade).toBe(resetWebSearchUsage);

    expect(settingsAPI.getWebSearchEmulationConfig).toBe(
      getWebSearchEmulationConfig,
    );
    expect(settingsAPI.updateWebSearchEmulationConfig).toBe(
      updateWebSearchEmulationConfig,
    );
    expect(settingsAPI.testWebSearchEmulation).toBe(testWebSearchEmulation);
    expect(settingsAPI.resetWebSearchUsage).toBe(resetWebSearchUsage);
  });
});

describe("admin Web Search ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminWebSearchDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminWebSearchQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminWebSearchActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );

  it("owns every Web Search protocol outside the compatibility datasource", () => {
    for (const dtoName of [
      "WebSearchProviderConfig",
      "WebSearchEmulationConfig",
      "WebSearchResult",
      "WebSearchTestResult",
      "ResetWebSearchUsageRequest",
    ]) {
      expect(dtoSource, dtoName).toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
      expect(compatibilitySource, dtoName).not.toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
    }
    expect(dtoSource).not.toContain("apiClient");
    expect(compatibilitySource).toContain('from "../dtos/adminWebSearchDtos"');
  });

  it("keeps requests and all consumers on explicit owners", () => {
    expect(querySource).toMatch(
      /export async function getWebSearchEmulationConfig\b/,
    );
    for (const functionName of [
      "updateWebSearchEmulationConfig",
      "testWebSearchEmulation",
      "resetWebSearchUsage",
    ]) {
      expect(actionSource).toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(compatibilitySource).not.toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
    }
    expect(compatibilitySource).not.toMatch(
      /export async function getWebSearchEmulationConfig\b/,
    );

    const composableSource = readFeatureSource(
      "presentation/composables/useSettingsWebSearch.ts",
    );
    const createAccountSource = readFeatureSource(
      "../admin-accounts/presentation/widgets/CreateAccountDialog.vue",
    );
    const editAccountSource = readFeatureSource(
      "../admin-accounts/presentation/widgets/EditAccountDialog.vue",
    );
    const channelsSource = readFeatureSource(
      "../admin-channels/presentation/pages/ChannelsPage.vue",
    );

    expect(composableSource).toContain("adminWebSearchQueries");
    expect(composableSource).toContain("adminWebSearchActions");
    expect(composableSource).toContain("adminWebSearchDtos");
    expect(composableSource).not.toContain("adminSettingsDatasource");
    expect(composableSource).not.toContain("settingsAPI.");
    expect(composableSource).not.toContain("import(");
    for (const source of [
      createAccountSource,
      editAccountSource,
      channelsSource,
    ]) {
      expect(source).toContain("adminWebSearchQueries");
      expect(source).not.toContain("adminAPI.settings.getWebSearchEmulationConfig");
    }
  });
});

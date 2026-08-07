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

import { updateBetaPolicySettings } from "@/features/admin-settings/data/datasources/adminBetaPolicyActions";
import { getBetaPolicySettings } from "@/features/admin-settings/data/datasources/adminBetaPolicyQueries";
import {
  getBetaPolicySettings as getBetaPolicySettingsFromFacade,
  settingsAPI,
  updateBetaPolicySettings as updateBetaPolicySettingsFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type {
  BetaPolicyRule,
  BetaPolicySettings,
} from "@/features/admin-settings/data/dtos/adminBetaPolicyDtos";
import { useSettingsGatewayPolicies } from "@/features/admin-settings/presentation/composables/useSettingsGatewayPolicies";

const settings: BetaPolicySettings = {
  rules: [
    {
      beta_token: "context-1m-2025-08-07",
      action: "pass",
      scope: "all",
      model_whitelist: ["claude-opus-*"],
      fallback_action: "filter",
    },
  ],
};

function deferred<T>() {
  let resolvePromise!: (value: T | PromiseLike<T>) => void;
  let rejectPromise!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, reject: rejectPromise, resolve: resolvePromise };
}

describe("admin beta policy datasource", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    showError.mockReset();
    showSuccess.mockReset();
  });

  it("reads the complete settings response from the existing endpoint", async () => {
    get.mockResolvedValueOnce({ data: settings });

    await expect(getBetaPolicySettings()).resolves.toEqual(settings);
    expect(get).toHaveBeenCalledWith("/admin/settings/beta-policy");
  });

  it("updates the existing endpoint with every beta policy field", async () => {
    const request: BetaPolicySettings = {
      rules: [
        {
          beta_token: "fast-mode-2026-02-01",
          action: "block",
          scope: "apikey",
          error_message: "blocked",
          model_whitelist: ["claude-opus-*"],
          fallback_action: "block",
          fallback_error_message: "fallback blocked",
        },
      ],
    };
    put.mockResolvedValueOnce({ data: settings });

    await expect(updateBetaPolicySettings(request)).resolves.toEqual(settings);
    expect(put).toHaveBeenCalledWith("/admin/settings/beta-policy", request);
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getBetaPolicySettingsFromFacade).toBe(getBetaPolicySettings);
    expect(updateBetaPolicySettingsFromFacade).toBe(updateBetaPolicySettings);
    expect(settingsAPI.getBetaPolicySettings).toBe(getBetaPolicySettings);
    expect(settingsAPI.updateBetaPolicySettings).toBe(
      updateBetaPolicySettings,
    );
  });
});

describe("beta policy settings controller", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    showError.mockReset();
    showSuccess.mockReset();
  });

  it("tracks loading and assigns the response", async () => {
    const pending = deferred<{ data: BetaPolicySettings }>();
    get.mockReturnValueOnce(pending.promise);
    const policies = useSettingsGatewayPolicies();
    policies.betaPolicyLoading.value = false;

    const loading = policies.loadBetaPolicySettings();

    expect(policies.betaPolicyLoading.value).toBe(true);
    pending.resolve({ data: settings });
    await loading;
    expect(policies.betaPolicyForm.rules).toEqual(settings.rules);
    expect(policies.betaPolicyLoading.value).toBe(false);
    expect(showError).not.toHaveBeenCalled();
  });

  it("keeps the current rules when the optional load fails silently", async () => {
    get.mockRejectedValueOnce(new Error("unavailable"));
    const policies = useSettingsGatewayPolicies();
    policies.betaPolicyForm.rules = [...settings.rules];

    await policies.loadBetaPolicySettings();

    expect(policies.betaPolicyForm.rules).toEqual(settings.rules);
    expect(policies.betaPolicyLoading.value).toBe(false);
    expect(showError).not.toHaveBeenCalled();
  });

  it("cleans optional fields, tracks saving, and assigns the response", async () => {
    const pending = deferred<{ data: BetaPolicySettings }>();
    put.mockReturnValueOnce(pending.promise);
    const policies = useSettingsGatewayPolicies();
    policies.betaPolicyForm.rules = [
      {
        beta_token: "context-1m-2025-08-07",
        action: "pass",
        scope: "all",
        error_message: "main error",
        model_whitelist: ["claude-opus-*", "", "   ", "claude-sonnet-*"],
        fallback_error_message: "discarded",
      },
      {
        beta_token: "fast-mode-2026-02-01",
        action: "filter",
        scope: "oauth",
        error_message: "",
        model_whitelist: ["", "   "],
        fallback_action: "block",
        fallback_error_message: "discarded",
      },
      {
        beta_token: "custom-beta",
        action: "block",
        scope: "bedrock",
        error_message: "blocked",
        model_whitelist: ["claude-*"],
        fallback_action: "block",
        fallback_error_message: "fallback blocked",
      },
    ];
    const updated: BetaPolicySettings = {
      rules: [{ ...settings.rules[0], action: "filter" }],
    };

    const saving = policies.saveBetaPolicySettings();

    expect(policies.betaPolicySaving.value).toBe(true);
    expect(put).toHaveBeenCalledWith("/admin/settings/beta-policy", {
      rules: [
        {
          beta_token: "context-1m-2025-08-07",
          action: "pass",
          scope: "all",
          error_message: "main error",
          model_whitelist: ["claude-opus-*", "claude-sonnet-*"],
          fallback_action: "pass",
        },
        {
          beta_token: "fast-mode-2026-02-01",
          action: "filter",
          scope: "oauth",
          error_message: "",
        },
        {
          beta_token: "custom-beta",
          action: "block",
          scope: "bedrock",
          error_message: "blocked",
          model_whitelist: ["claude-*"],
          fallback_action: "block",
          fallback_error_message: "fallback blocked",
        },
      ],
    });
    pending.resolve({ data: updated });
    await saving;
    expect(policies.betaPolicyForm.rules).toEqual(updated.rules);
    expect(policies.betaPolicySaving.value).toBe(false);
    expect(showSuccess).toHaveBeenCalledWith(
      "admin.settings.betaPolicy.saved",
    );
    expect(showError).not.toHaveBeenCalled();
  });

  it("reports save errors and always clears the saving flag", async () => {
    put.mockRejectedValueOnce(new Error("save unavailable"));
    const policies = useSettingsGatewayPolicies();
    const originalRule: BetaPolicyRule = {
      beta_token: "context-1m-2025-08-07",
      action: "pass",
      scope: "all",
    };
    policies.betaPolicyForm.rules = [originalRule];

    await policies.saveBetaPolicySettings();

    expect(policies.betaPolicyForm.rules).toEqual([originalRule]);
    expect(policies.betaPolicySaving.value).toBe(false);
    expect(showError).toHaveBeenCalledWith("save unavailable");
    expect(showSuccess).not.toHaveBeenCalled();
  });
});

describe("admin beta policy ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminBetaPolicyDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminBetaPolicyQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminBetaPolicyActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const composableSource = readFeatureSource(
    "presentation/composables/useSettingsGatewayPolicies.ts",
  );

  it("owns the protocol and requests outside the compatibility datasource", () => {
    expect(dtoSource).toMatch(/export type BetaPolicyAction\b/);
    expect(dtoSource).toMatch(/export type BetaPolicyScope\b/);
    expect(dtoSource).toMatch(/export interface BetaPolicyRule\b/);
    expect(dtoSource).toMatch(/export interface BetaPolicySettings\b/);
    expect(dtoSource).not.toContain("apiClient");
    expect(querySource).toMatch(
      /export async function getBetaPolicySettings\b/,
    );
    expect(actionSource).toMatch(
      /export async function updateBetaPolicySettings\b/,
    );
    expect(compatibilitySource).not.toMatch(
      /export (?:type|interface) BetaPolicy/,
    );
    expect(compatibilitySource).not.toMatch(
      /export async function (?:get|update)BetaPolicySettings\b/,
    );
    expect(composableSource).toContain("adminBetaPolicyQueries");
    expect(composableSource).toContain("adminBetaPolicyActions");
    expect(composableSource).not.toContain("settingsAPI.getBetaPolicySettings");
    expect(composableSource).not.toContain(
      "settingsAPI.updateBetaPolicySettings",
    );
    expect(composableSource).not.toContain("import(");
  });
});

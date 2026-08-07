import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { deleteRequest, get, post, put } = vi.hoisted(() => ({
  deleteRequest: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/core/networks/client", () => ({
  apiClient: { delete: deleteRequest, get, post, put },
}));

import {
  createAdminApiKey,
  deleteAdminApiKey,
  regenerateAdminApiKey,
  revokeAdminApiKey,
  rotateAdminApiKey,
  updateAdminApiKey,
} from "@/features/admin-settings/data/datasources/adminApiKeyActions";
import {
  getAdminApiKey,
  listAdminApiKeys,
} from "@/features/admin-settings/data/datasources/adminApiKeyQueries";
import {
  createAdminApiKey as createAdminApiKeyFromFacade,
  deleteAdminApiKey as deleteAdminApiKeyFromFacade,
  getAdminApiKey as getAdminApiKeyFromFacade,
  listAdminApiKeys as listAdminApiKeysFromFacade,
  regenerateAdminApiKey as regenerateAdminApiKeyFromFacade,
  revokeAdminApiKey as revokeAdminApiKeyFromFacade,
  rotateAdminApiKey as rotateAdminApiKeyFromFacade,
  settingsAPI,
  updateAdminApiKey as updateAdminApiKeyFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import type {
  AdminApiKey,
  CreateAdminApiKeyRequest,
  UpdateAdminApiKeyRequest,
} from "@/features/admin-settings/data/dtos/adminApiKeyDtos";

const metadata: AdminApiKey = {
  id: "key/id with spaces",
  name: "Automation",
  key_prefix: "sk-admin",
  last_four: "1234",
  scopes: ["admin.read", "admin.settings.write"],
  status: "active",
  expires_at: "2026-09-01T00:00:00.000Z",
  created_by: 1,
  last_used_at: null,
  created_at: "2026-08-06T00:00:00.000Z",
  updated_at: "2026-08-06T00:00:00.000Z",
  revoked_at: null,
};

describe("admin API key datasource", () => {
  beforeEach(() => {
    deleteRequest.mockReset();
    get.mockReset();
    post.mockReset();
    put.mockReset();
  });

  it("keeps scoped and legacy reads on the query owner", async () => {
    const listResponse = { items: [metadata] };
    const statusResponse = { exists: true, masked_key: "sk-admin...1234" };
    get
      .mockResolvedValueOnce({ data: listResponse })
      .mockResolvedValueOnce({ data: statusResponse });

    await expect(listAdminApiKeys()).resolves.toEqual(listResponse);
    await expect(getAdminApiKey()).resolves.toEqual(statusResponse);

    expect(get).toHaveBeenNthCalledWith(
      1,
      "/admin/settings/admin-api-keys",
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/admin/settings/admin-api-key",
    );
  });

  it("preserves scoped create, update, rotate, and revoke contracts", async () => {
    const createRequest: CreateAdminApiKeyRequest = {
      name: "Automation",
      scopes: ["admin.read"],
      expires_at: "2026-09-01T00:00:00.000Z",
    };
    const updateRequest: UpdateAdminApiKeyRequest = {
      name: "Rotated automation",
      scopes: ["admin.settings.read"],
      expires_at: null,
    };
    const secretResponse = { key: "sk-admin-secret", metadata };
    const updatedMetadata = { ...metadata, name: updateRequest.name! };
    post
      .mockResolvedValueOnce({ data: secretResponse })
      .mockResolvedValueOnce({ data: secretResponse });
    put.mockResolvedValueOnce({ data: updatedMetadata });
    deleteRequest.mockResolvedValueOnce({ data: { message: "revoked" } });

    await expect(createAdminApiKey(createRequest)).resolves.toEqual(
      secretResponse,
    );
    await expect(
      updateAdminApiKey(metadata.id, updateRequest),
    ).resolves.toEqual(updatedMetadata);
    await expect(rotateAdminApiKey(metadata.id)).resolves.toEqual(
      secretResponse,
    );
    await expect(revokeAdminApiKey(metadata.id)).resolves.toEqual({
      message: "revoked",
    });

    const encodedId = "key%2Fid%20with%20spaces";
    expect(post).toHaveBeenNthCalledWith(
      1,
      "/admin/settings/admin-api-keys",
      createRequest,
    );
    expect(put).toHaveBeenCalledWith(
      `/admin/settings/admin-api-keys/${encodedId}`,
      updateRequest,
    );
    expect(post).toHaveBeenNthCalledWith(
      2,
      `/admin/settings/admin-api-keys/${encodedId}/rotate`,
    );
    expect(deleteRequest).toHaveBeenCalledWith(
      `/admin/settings/admin-api-keys/${encodedId}`,
    );
  });

  it("preserves legacy regenerate and delete contracts", async () => {
    post.mockResolvedValueOnce({ data: { key: "sk-admin-legacy" } });
    deleteRequest.mockResolvedValueOnce({ data: { message: "deleted" } });

    await expect(regenerateAdminApiKey()).resolves.toEqual({
      key: "sk-admin-legacy",
    });
    await expect(deleteAdminApiKey()).resolves.toEqual({ message: "deleted" });

    expect(post).toHaveBeenCalledWith(
      "/admin/settings/admin-api-key/regenerate",
    );
    expect(deleteRequest).toHaveBeenCalledWith(
      "/admin/settings/admin-api-key",
    );
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(listAdminApiKeysFromFacade).toBe(listAdminApiKeys);
    expect(getAdminApiKeyFromFacade).toBe(getAdminApiKey);
    expect(createAdminApiKeyFromFacade).toBe(createAdminApiKey);
    expect(updateAdminApiKeyFromFacade).toBe(updateAdminApiKey);
    expect(rotateAdminApiKeyFromFacade).toBe(rotateAdminApiKey);
    expect(revokeAdminApiKeyFromFacade).toBe(revokeAdminApiKey);
    expect(regenerateAdminApiKeyFromFacade).toBe(regenerateAdminApiKey);
    expect(deleteAdminApiKeyFromFacade).toBe(deleteAdminApiKey);

    expect(settingsAPI.listAdminApiKeys).toBe(listAdminApiKeys);
    expect(settingsAPI.getAdminApiKey).toBe(getAdminApiKey);
    expect(settingsAPI.createAdminApiKey).toBe(createAdminApiKey);
    expect(settingsAPI.updateAdminApiKey).toBe(updateAdminApiKey);
    expect(settingsAPI.rotateAdminApiKey).toBe(rotateAdminApiKey);
    expect(settingsAPI.revokeAdminApiKey).toBe(revokeAdminApiKey);
    expect(settingsAPI.regenerateAdminApiKey).toBe(regenerateAdminApiKey);
    expect(settingsAPI.deleteAdminApiKey).toBe(deleteAdminApiKey);
  });
});

describe("admin API key ownership", () => {
  const featureDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource("data/dtos/adminApiKeyDtos.ts");
  const querySource = readFeatureSource(
    "data/datasources/adminApiKeyQueries.ts",
  );
  const actionSource = readFeatureSource(
    "data/datasources/adminApiKeyActions.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const composableSource = readFeatureSource(
    "presentation/composables/useSettingsAdminApiKeys.ts",
  );

  it("owns all API key contracts outside the compatibility datasource", () => {
    for (const dtoName of [
      "AdminApiKeyStatus",
      "AdminApiKey",
      "CreateAdminApiKeyRequest",
      "UpdateAdminApiKeyRequest",
    ]) {
      expect(dtoSource, dtoName).toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
      expect(compatibilitySource, dtoName).not.toMatch(
        new RegExp(`export interface ${dtoName}\\b`),
      );
    }
    expect(dtoSource).toMatch(/export type AdminApiKeyScope\b/);
    expect(compatibilitySource).not.toMatch(/export type AdminApiKeyScope\b/);
    expect(dtoSource).not.toContain("apiClient");
    expect(compatibilitySource).toContain('from "../dtos/adminApiKeyDtos"');
  });

  it("keeps request code and presentation on the explicit owners", () => {
    for (const functionName of ["listAdminApiKeys", "getAdminApiKey"]) {
      expect(querySource).toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(compatibilitySource).not.toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
    }
    for (const functionName of [
      "createAdminApiKey",
      "updateAdminApiKey",
      "rotateAdminApiKey",
      "revokeAdminApiKey",
      "regenerateAdminApiKey",
      "deleteAdminApiKey",
    ]) {
      expect(actionSource).toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
      expect(compatibilitySource).not.toMatch(
        new RegExp(`export async function ${functionName}\\b`),
      );
    }
    expect(composableSource).toContain("adminApiKeyQueries");
    expect(composableSource).toContain("adminApiKeyActions");
    expect(composableSource).toContain("adminApiKeyDtos");
    expect(composableSource).not.toContain("adminSettingsDatasource");
    expect(composableSource).not.toContain("settingsAPI.");
    expect(composableSource).not.toContain("import(");
  });
});

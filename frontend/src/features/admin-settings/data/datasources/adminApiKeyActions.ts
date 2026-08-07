import { apiClient } from "@/core/networks/client";
import type {
  AdminApiKey,
  CreateAdminApiKeyRequest,
  UpdateAdminApiKeyRequest,
} from "@/features/admin-settings/data/dtos/adminApiKeyDtos";

export async function createAdminApiKey(
  request: CreateAdminApiKeyRequest,
): Promise<{ key: string; metadata: AdminApiKey }> {
  const { data } = await apiClient.post<{ key: string; metadata: AdminApiKey }>(
    "/admin/settings/admin-api-keys",
    request,
  );
  return data;
}

export async function updateAdminApiKey(
  id: string,
  request: UpdateAdminApiKeyRequest,
): Promise<AdminApiKey> {
  const { data } = await apiClient.put<AdminApiKey>(
    `/admin/settings/admin-api-keys/${encodeURIComponent(id)}`,
    request,
  );
  return data;
}

export async function rotateAdminApiKey(
  id: string,
): Promise<{ key: string; metadata: AdminApiKey }> {
  const { data } = await apiClient.post<{ key: string; metadata: AdminApiKey }>(
    `/admin/settings/admin-api-keys/${encodeURIComponent(id)}/rotate`,
  );
  return data;
}

export async function revokeAdminApiKey(
  id: string,
): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(
    `/admin/settings/admin-api-keys/${encodeURIComponent(id)}`,
  );
  return data;
}

export async function regenerateAdminApiKey(): Promise<{ key: string }> {
  const { data } = await apiClient.post<{ key: string }>(
    "/admin/settings/admin-api-key/regenerate",
  );
  return data;
}

export async function deleteAdminApiKey(): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(
    "/admin/settings/admin-api-key",
  );
  return data;
}

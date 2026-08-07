import { apiClient } from "@/core/networks/client";
import type {
  AdminApiKey,
  AdminApiKeyStatus,
} from "@/features/admin-settings/data/dtos/adminApiKeyDtos";

export async function listAdminApiKeys(): Promise<{ items: AdminApiKey[] }> {
  const { data } = await apiClient.get<{ items: AdminApiKey[] }>(
    "/admin/settings/admin-api-keys",
  );
  return data;
}

export async function getAdminApiKey(): Promise<AdminApiKeyStatus> {
  const { data } = await apiClient.get<AdminApiKeyStatus>(
    "/admin/settings/admin-api-key",
  );
  return data;
}

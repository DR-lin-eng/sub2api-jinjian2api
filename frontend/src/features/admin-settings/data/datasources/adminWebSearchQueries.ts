import { apiClient } from "@/core/networks/client";
import type { WebSearchEmulationConfig } from "@/features/admin-settings/data/dtos/adminWebSearchDtos";

export async function getWebSearchEmulationConfig(): Promise<WebSearchEmulationConfig> {
  const { data } = await apiClient.get<WebSearchEmulationConfig>(
    "/admin/settings/web-search-emulation",
  );
  return data;
}

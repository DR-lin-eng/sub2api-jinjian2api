import { apiClient } from "@/core/networks/client";
import type {
  ResetWebSearchUsageRequest,
  WebSearchEmulationConfig,
  WebSearchTestResult,
} from "@/features/admin-settings/data/dtos/adminWebSearchDtos";

export async function updateWebSearchEmulationConfig(
  config: WebSearchEmulationConfig,
): Promise<WebSearchEmulationConfig> {
  const { data } = await apiClient.put<WebSearchEmulationConfig>(
    "/admin/settings/web-search-emulation",
    config,
  );
  return data;
}

export async function testWebSearchEmulation(
  query: string,
): Promise<WebSearchTestResult> {
  const { data } = await apiClient.post<WebSearchTestResult>(
    "/admin/settings/web-search-emulation/test",
    { query },
  );
  return data;
}

export async function resetWebSearchUsage(
  payload: ResetWebSearchUsageRequest,
): Promise<void> {
  await apiClient.post(
    "/admin/settings/web-search-emulation/reset-usage",
    payload,
  );
}

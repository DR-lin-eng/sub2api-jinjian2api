import { apiClient } from "@/core/networks/client";
import type { StreamTimeoutSettings } from "@/features/admin-settings/data/dtos/adminStreamTimeoutDtos";

export async function updateStreamTimeoutSettings(
  settings: StreamTimeoutSettings,
): Promise<StreamTimeoutSettings> {
  const { data } = await apiClient.put<StreamTimeoutSettings>(
    "/admin/settings/stream-timeout",
    settings,
  );
  return data;
}

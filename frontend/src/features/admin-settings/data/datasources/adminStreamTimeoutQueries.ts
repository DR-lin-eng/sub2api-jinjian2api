import { apiClient } from "@/core/networks/client";
import type { StreamTimeoutSettings } from "@/features/admin-settings/data/dtos/adminStreamTimeoutDtos";

export async function getStreamTimeoutSettings(): Promise<StreamTimeoutSettings> {
  const { data } = await apiClient.get<StreamTimeoutSettings>(
    "/admin/settings/stream-timeout",
  );
  return data;
}

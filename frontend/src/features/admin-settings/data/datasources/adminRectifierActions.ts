import { apiClient } from "@/core/networks/client";
import type { RectifierSettings } from "@/features/admin-settings/data/dtos/adminRectifierDtos";

export async function updateRectifierSettings(
  settings: RectifierSettings,
): Promise<RectifierSettings> {
  const { data } = await apiClient.put<RectifierSettings>(
    "/admin/settings/rectifier",
    settings,
  );
  return data;
}

import { apiClient } from "@/core/networks/client";
import type { RectifierSettings } from "@/features/admin-settings/data/dtos/adminRectifierDtos";

export async function getRectifierSettings(): Promise<RectifierSettings> {
  const { data } = await apiClient.get<RectifierSettings>(
    "/admin/settings/rectifier",
  );
  return data;
}

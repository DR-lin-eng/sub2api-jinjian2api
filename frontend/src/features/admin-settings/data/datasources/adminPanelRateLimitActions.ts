import { apiClient } from "@/core/networks/client";
import {
  normalizePanelRateLimitSettings,
  type PanelRateLimitSettings,
} from "@/features/admin-settings/data/dtos/adminPanelRateLimitDtos";

export async function updatePanelRateLimitSettings(
  settings: PanelRateLimitSettings,
): Promise<PanelRateLimitSettings> {
  const { data } = await apiClient.put<unknown>(
    "/admin/settings/panel-rate-limit",
    settings,
  );
  return normalizePanelRateLimitSettings(data);
}

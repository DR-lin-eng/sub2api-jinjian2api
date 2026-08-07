import { apiClient } from "@/core/networks/client";
import {
  normalizePanelRateLimitSettings,
  type PanelRateLimitSettings,
} from "@/features/admin-settings/data/dtos/adminPanelRateLimitDtos";

export async function getPanelRateLimitSettings(): Promise<PanelRateLimitSettings> {
  const { data } = await apiClient.get<unknown>(
    "/admin/settings/panel-rate-limit",
  );
  return normalizePanelRateLimitSettings(data);
}

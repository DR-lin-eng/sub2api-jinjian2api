import { apiClient } from "@/core/networks/client";
import type { BetaPolicySettings } from "@/features/admin-settings/data/dtos/adminBetaPolicyDtos";

export async function updateBetaPolicySettings(
  settings: BetaPolicySettings,
): Promise<BetaPolicySettings> {
  const { data } = await apiClient.put<BetaPolicySettings>(
    "/admin/settings/beta-policy",
    settings,
  );
  return data;
}

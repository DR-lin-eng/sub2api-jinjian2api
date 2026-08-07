import { apiClient } from "@/core/networks/client";
import type { BetaPolicySettings } from "@/features/admin-settings/data/dtos/adminBetaPolicyDtos";

export async function getBetaPolicySettings(): Promise<BetaPolicySettings> {
  const { data } = await apiClient.get<BetaPolicySettings>(
    "/admin/settings/beta-policy",
  );
  return data;
}

import { apiClient } from "@/core/networks/client";
import type {
  GlobalTempUnschedulableSettings,
  OverloadCooldownSettings,
  RateLimit429CooldownSettings,
} from "@/features/admin-settings/data/dtos/adminSchedulerResilienceDtos";

export async function updateOverloadCooldownSettings(
  settings: OverloadCooldownSettings,
): Promise<OverloadCooldownSettings> {
  const { data } = await apiClient.put<OverloadCooldownSettings>(
    "/admin/settings/overload-cooldown",
    settings,
  );
  return data;
}

export async function updateRateLimit429CooldownSettings(
  settings: RateLimit429CooldownSettings,
): Promise<RateLimit429CooldownSettings> {
  const { data } = await apiClient.put<RateLimit429CooldownSettings>(
    "/admin/settings/rate-limit-429-cooldown",
    settings,
  );
  return data;
}

export async function updateGlobalTempUnschedulableSettings(
  settings: GlobalTempUnschedulableSettings,
): Promise<GlobalTempUnschedulableSettings> {
  const { data } = await apiClient.put<GlobalTempUnschedulableSettings>(
    "/admin/settings/temp-unschedulable",
    settings,
  );
  return data;
}

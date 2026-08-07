import { apiClient } from "@/core/networks/client";
import type {
  GlobalTempUnschedulableSettings,
  OverloadCooldownSettings,
  RateLimit429CooldownSettings,
} from "@/features/admin-settings/data/dtos/adminSchedulerResilienceDtos";

export async function getOverloadCooldownSettings(): Promise<OverloadCooldownSettings> {
  const { data } = await apiClient.get<OverloadCooldownSettings>(
    "/admin/settings/overload-cooldown",
  );
  return data;
}

export async function getRateLimit429CooldownSettings(): Promise<RateLimit429CooldownSettings> {
  const { data } = await apiClient.get<RateLimit429CooldownSettings>(
    "/admin/settings/rate-limit-429-cooldown",
  );
  return data;
}

export async function getGlobalTempUnschedulableSettings(): Promise<GlobalTempUnschedulableSettings> {
  const { data } = await apiClient.get<GlobalTempUnschedulableSettings>(
    "/admin/settings/temp-unschedulable",
  );
  return data;
}

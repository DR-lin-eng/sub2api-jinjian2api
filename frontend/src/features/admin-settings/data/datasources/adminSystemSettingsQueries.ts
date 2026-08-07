import { apiClient } from "@/core/networks/client";
import type { SystemSettings } from "../dtos/adminSystemSettingsDtos";

/** Read the complete administrator-managed system settings document. */
export async function getSettings(): Promise<SystemSettings> {
  const { data } = await apiClient.get<SystemSettings>("/admin/settings");
  return data;
}

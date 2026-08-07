import { apiClient } from "@/core/networks/client";
import type {
  SystemSettings,
  UpdateSettingsRequest,
} from "../dtos/adminSystemSettingsDtos";

/** Persist a partial system settings update and return the applied document. */
export async function updateSettings(
  settings: UpdateSettingsRequest,
): Promise<SystemSettings> {
  const { data } = await apiClient.put<SystemSettings>(
    "/admin/settings",
    settings,
  );
  return data;
}

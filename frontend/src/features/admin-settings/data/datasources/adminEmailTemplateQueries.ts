import { apiClient } from "@/core/networks/client";
import type {
  EmailTemplateDetail,
  EmailTemplateListResponse,
} from "@/features/admin-settings/data/dtos/adminEmailTemplateDtos";

export async function getEmailTemplates(): Promise<EmailTemplateListResponse> {
  const { data } = await apiClient.get<EmailTemplateListResponse>(
    "/admin/settings/email-templates",
  );
  return data;
}

export async function getEmailTemplate(
  event: string,
  locale: string,
): Promise<EmailTemplateDetail> {
  const { data } = await apiClient.get<EmailTemplateDetail>(
    `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}`,
  );
  return data;
}

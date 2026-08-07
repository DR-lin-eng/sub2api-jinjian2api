import { apiClient } from "@/core/networks/client";
import type {
  EmailTemplateDetail,
  EmailTemplatePreviewResponse,
  PreviewEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from "@/features/admin-settings/data/dtos/adminEmailTemplateDtos";

export async function updateEmailTemplate(
  event: string,
  locale: string,
  request: UpdateEmailTemplateRequest,
): Promise<EmailTemplateDetail> {
  const { data } = await apiClient.put<EmailTemplateDetail>(
    `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}`,
    request,
  );
  return data;
}

export async function restoreOfficialEmailTemplate(
  event: string,
  locale: string,
): Promise<EmailTemplateDetail> {
  const { data } = await apiClient.post<EmailTemplateDetail>(
    `/admin/settings/email-templates/${encodeURIComponent(event)}/${encodeURIComponent(locale)}/restore-official`,
  );
  return data;
}

export async function previewEmailTemplate(
  request: PreviewEmailTemplateRequest,
): Promise<EmailTemplatePreviewResponse> {
  const { data } = await apiClient.post<EmailTemplatePreviewResponse>(
    "/admin/settings/email-template-preview",
    request,
  );
  return data;
}

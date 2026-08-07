export interface EmailTemplateOption {
  value: string;
  label?: string;
  description?: string;
  category?: string;
}

export type EmailTemplateEventOption = string | EmailTemplateOption;

export interface EmailTemplateSummary {
  event: string;
  locale: string;
  subject: string;
  is_custom?: boolean;
  updated_at?: string;
}

export interface EmailTemplateListResponse {
  events: EmailTemplateEventOption[];
  locales: string[];
  templates?: EmailTemplateSummary[];
  placeholders?: string[];
}

export interface EmailTemplateDetail {
  event: string;
  locale: string;
  subject: string;
  html: string;
  is_custom?: boolean;
  updated_at?: string;
  placeholders?: string[];
}

export interface UpdateEmailTemplateRequest {
  subject: string;
  html: string;
}

export interface PreviewEmailTemplateRequest
  extends UpdateEmailTemplateRequest {
  event: string;
  locale: string;
}

export interface EmailTemplatePreviewResponse {
  subject: string;
  html: string;
}

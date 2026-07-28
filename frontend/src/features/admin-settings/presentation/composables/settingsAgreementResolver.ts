import type { LoginAgreementDocument } from '@/types'

  export function defaultLoginAgreementDocuments(
    localText: (zh: string, en: string) => string,
  ): LoginAgreementDocument[] {
    return [
      {
        id: "terms",
        title: localText("服务条款", "Terms of Service"),
        content_md: "",
      },
      {
        id: "usage-policy",
        title: localText("使用政策", "Usage Policy"),
        content_md: "",
      },
      {
        id: "supported-regions",
        title: localText("支持的国家和地区", "Supported Countries and Regions"),
        content_md: "",
      },
      {
        id: "service-specific-terms",
        title: localText("服务特定条款", "Service-Specific Terms"),
        content_md: "",
      },
    ];
  }

  export function normalizeLoginAgreementDocumentId(raw: string): string {
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/[-_]{2,}/g, "-")
      .replace(/^[-_]+|[-_]+$/g, "");
  }

  export function loginAgreementRoutePath(
    doc: LoginAgreementDocument,
    index: number,
  ): string {
    const id =
      normalizeLoginAgreementDocumentId(doc.id || doc.title) || `doc-${index + 1}`;
    return `/legal/${id}`;
  }

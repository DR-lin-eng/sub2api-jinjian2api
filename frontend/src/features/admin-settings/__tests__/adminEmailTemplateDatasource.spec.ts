import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post, put } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/core/networks/client", () => ({
  apiClient: { get, post, put },
}));

import {
  previewEmailTemplate,
  restoreOfficialEmailTemplate,
  updateEmailTemplate,
} from "@/features/admin-settings/data/datasources/adminEmailTemplateActions";
import {
  getEmailTemplate,
  getEmailTemplates,
} from "@/features/admin-settings/data/datasources/adminEmailTemplateQueries";
import {
  getEmailTemplate as getEmailTemplateFromFacade,
  getEmailTemplates as getEmailTemplatesFromFacade,
  previewEmailTemplate as previewEmailTemplateFromFacade,
  restoreOfficialEmailTemplate as restoreOfficialEmailTemplateFromFacade,
  settingsAPI,
  updateEmailTemplate as updateEmailTemplateFromFacade,
} from "@/features/admin-settings/data/datasources/adminSettingsDatasource";

describe("admin email template datasource", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
    put.mockReset();
  });

  it("keeps list and detail reads on the email-template query owner", async () => {
    const listResponse = {
      events: ["auth.verify_code"],
      locales: ["zh-CN"],
      placeholders: ["site_name"],
    };
    const detailResponse = {
      event: "ops.alert/daily",
      locale: "zh-CN preview",
      subject: "Alert",
      html: "<p>Alert</p>",
    };
    get
      .mockResolvedValueOnce({ data: listResponse })
      .mockResolvedValueOnce({ data: detailResponse });

    await expect(getEmailTemplates()).resolves.toEqual(listResponse);
    await expect(
      getEmailTemplate("ops.alert/daily", "zh-CN preview"),
    ).resolves.toEqual(detailResponse);

    expect(get).toHaveBeenNthCalledWith(
      1,
      "/admin/settings/email-templates",
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/admin/settings/email-templates/ops.alert%2Fdaily/zh-CN%20preview",
    );
  });

  it("preserves update, restore, and preview request contracts", async () => {
    const detailResponse = {
      event: "ops.alert/daily",
      locale: "en-US preview",
      subject: "Updated",
      html: "<p>Updated</p>",
      is_custom: true,
    };
    const updateRequest = {
      subject: "Updated",
      html: "<p>Updated</p>",
    };
    const previewRequest = {
      event: "ops.alert/daily",
      locale: "en-US preview",
      ...updateRequest,
    };
    put.mockResolvedValueOnce({ data: detailResponse });
    post
      .mockResolvedValueOnce({ data: { ...detailResponse, is_custom: false } })
      .mockResolvedValueOnce({
        data: { subject: "Preview", html: "<p>Preview</p>" },
      });

    await expect(
      updateEmailTemplate(
        "ops.alert/daily",
        "en-US preview",
        updateRequest,
      ),
    ).resolves.toEqual(detailResponse);
    await restoreOfficialEmailTemplate("ops.alert/daily", "en-US preview");
    await expect(previewEmailTemplate(previewRequest)).resolves.toEqual({
      subject: "Preview",
      html: "<p>Preview</p>",
    });

    expect(put).toHaveBeenCalledWith(
      "/admin/settings/email-templates/ops.alert%2Fdaily/en-US%20preview",
      updateRequest,
    );
    expect(post).toHaveBeenNthCalledWith(
      1,
      "/admin/settings/email-templates/ops.alert%2Fdaily/en-US%20preview/restore-official",
    );
    expect(post).toHaveBeenNthCalledWith(
      2,
      "/admin/settings/email-template-preview",
      previewRequest,
    );
  });

  it("keeps the compatibility facade on the same function identities", () => {
    expect(getEmailTemplatesFromFacade).toBe(getEmailTemplates);
    expect(getEmailTemplateFromFacade).toBe(getEmailTemplate);
    expect(updateEmailTemplateFromFacade).toBe(updateEmailTemplate);
    expect(restoreOfficialEmailTemplateFromFacade).toBe(
      restoreOfficialEmailTemplate,
    );
    expect(previewEmailTemplateFromFacade).toBe(previewEmailTemplate);
    expect(settingsAPI.getEmailTemplates).toBe(getEmailTemplates);
    expect(settingsAPI.getEmailTemplate).toBe(getEmailTemplate);
    expect(settingsAPI.updateEmailTemplate).toBe(updateEmailTemplate);
    expect(settingsAPI.restoreOfficialEmailTemplate).toBe(
      restoreOfficialEmailTemplate,
    );
    expect(settingsAPI.previewEmailTemplate).toBe(previewEmailTemplate);
  });
});

describe("admin email template ownership", () => {
  const featureDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const readFeatureSource = (relativePath: string) =>
    readFileSync(resolve(featureDir, relativePath), "utf8");
  const dtoSource = readFeatureSource(
    "data/dtos/adminEmailTemplateDtos.ts",
  );
  const compatibilitySource = readFeatureSource(
    "data/datasources/adminSettingsDatasource.ts",
  );
  const editorSource = readFeatureSource(
    "presentation/widgets/EmailTemplateEditor.vue",
  );

  it("owns email-template DTO declarations outside the compatibility datasource", () => {
    for (const dtoName of [
      "EmailTemplateOption",
      "EmailTemplateSummary",
      "EmailTemplateListResponse",
      "EmailTemplateDetail",
      "UpdateEmailTemplateRequest",
      "PreviewEmailTemplateRequest",
      "EmailTemplatePreviewResponse",
    ]) {
      const declaration = new RegExp(`export interface ${dtoName}\\b`);
      expect(dtoSource, dtoName).toMatch(declaration);
      expect(compatibilitySource, dtoName).not.toMatch(declaration);
    }
    expect(dtoSource).toMatch(/export type EmailTemplateEventOption\b/);
    expect(compatibilitySource).not.toMatch(
      /export type EmailTemplateEventOption\b/,
    );
    expect(compatibilitySource).toContain(
      'from "../dtos/adminEmailTemplateDtos"',
    );
  });

  it("routes the editor through explicit owners without legacy barrels", () => {
    expect(editorSource).toContain(
      "data/datasources/adminEmailTemplateQueries",
    );
    expect(editorSource).toContain(
      "data/datasources/adminEmailTemplateActions",
    );
    expect(editorSource).toContain("data/dtos/adminEmailTemplateDtos");
    expect(editorSource).toContain("@/core/stores/appStore");
    expect(editorSource).not.toContain('from "@/api"');
    expect(editorSource).not.toContain('from "@/stores"');
    expect(editorSource).not.toContain("adminAPI.settings");
  });
});

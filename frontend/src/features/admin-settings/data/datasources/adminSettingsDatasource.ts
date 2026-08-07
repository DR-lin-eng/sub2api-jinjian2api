/**
 * Admin Settings API endpoints
 * Handles system settings management for administrators
 */

import { apiClient } from '@/core/networks/client';
import { updateBetaPolicySettings } from "./adminBetaPolicyActions";
import { getBetaPolicySettings } from "./adminBetaPolicyQueries";
import {
  createAdminApiKey,
  deleteAdminApiKey,
  regenerateAdminApiKey,
  revokeAdminApiKey,
  rotateAdminApiKey,
  updateAdminApiKey,
} from "./adminApiKeyActions";
import {
  getAdminApiKey,
  listAdminApiKeys,
} from "./adminApiKeyQueries";
import {
  previewEmailTemplate,
  restoreOfficialEmailTemplate,
  updateEmailTemplate,
} from "./adminEmailTemplateActions";
import {
  getEmailTemplate,
  getEmailTemplates,
} from "./adminEmailTemplateQueries";
import { updatePanelRateLimitSettings } from "./adminPanelRateLimitActions";
import { getPanelRateLimitSettings } from "./adminPanelRateLimitQueries";
import { updateRectifierSettings } from "./adminRectifierActions";
import { getRectifierSettings } from "./adminRectifierQueries";
import {
  updateGlobalTempUnschedulableSettings,
  updateOverloadCooldownSettings,
  updateRateLimit429CooldownSettings,
} from "./adminSchedulerResilienceActions";
import {
  getGlobalTempUnschedulableSettings,
  getOverloadCooldownSettings,
  getRateLimit429CooldownSettings,
} from "./adminSchedulerResilienceQueries";
import { updateStreamTimeoutSettings } from "./adminStreamTimeoutActions";
import { getStreamTimeoutSettings } from "./adminStreamTimeoutQueries";
import { updateSettings } from "./adminSystemSettingsActions";
import { getSettings } from "./adminSystemSettingsQueries";
import {
  resetWebSearchUsage,
  testWebSearchEmulation,
  updateWebSearchEmulationConfig,
} from "./adminWebSearchActions";
import { getWebSearchEmulationConfig } from "./adminWebSearchQueries";

export {
  getEmailTemplate,
  getEmailTemplates,
} from "./adminEmailTemplateQueries";
export { updateBetaPolicySettings } from "./adminBetaPolicyActions";
export { getBetaPolicySettings } from "./adminBetaPolicyQueries";
export type {
  BetaPolicyAction,
  BetaPolicyRule,
  BetaPolicyScope,
  BetaPolicySettings,
} from "../dtos/adminBetaPolicyDtos";
export {
  getAdminApiKey,
  listAdminApiKeys,
} from "./adminApiKeyQueries";
export {
  createAdminApiKey,
  deleteAdminApiKey,
  regenerateAdminApiKey,
  revokeAdminApiKey,
  rotateAdminApiKey,
  updateAdminApiKey,
} from "./adminApiKeyActions";
export type {
  AdminApiKey,
  AdminApiKeyScope,
  AdminApiKeyStatus,
  CreateAdminApiKeyRequest,
  UpdateAdminApiKeyRequest,
} from "../dtos/adminApiKeyDtos";
export { getWebSearchEmulationConfig } from "./adminWebSearchQueries";
export {
  resetWebSearchUsage,
  testWebSearchEmulation,
  updateWebSearchEmulationConfig,
} from "./adminWebSearchActions";
export type {
  ResetWebSearchUsageRequest,
  WebSearchEmulationConfig,
  WebSearchProviderConfig,
  WebSearchResult,
  WebSearchTestResult,
} from "../dtos/adminWebSearchDtos";
export {
  previewEmailTemplate,
  restoreOfficialEmailTemplate,
  updateEmailTemplate,
} from "./adminEmailTemplateActions";
export type {
  EmailTemplateDetail,
  EmailTemplateEventOption,
  EmailTemplateListResponse,
  EmailTemplateOption,
  EmailTemplatePreviewResponse,
  EmailTemplateSummary,
  PreviewEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from "../dtos/adminEmailTemplateDtos";
export { updatePanelRateLimitSettings } from "./adminPanelRateLimitActions";
export { getPanelRateLimitSettings } from "./adminPanelRateLimitQueries";
export {
  DEFAULT_PANEL_RATE_LIMIT_SETTINGS,
  normalizePanelRateLimitSettings,
} from "../dtos/adminPanelRateLimitDtos";
export type { PanelRateLimitSettings } from "../dtos/adminPanelRateLimitDtos";
export { updateRectifierSettings } from "./adminRectifierActions";
export { getRectifierSettings } from "./adminRectifierQueries";
export type {
  RectifierSettings,
  ThinkingDisplayMode,
} from "../dtos/adminRectifierDtos";
export {
  updateGlobalTempUnschedulableSettings,
  updateOverloadCooldownSettings,
  updateRateLimit429CooldownSettings,
} from "./adminSchedulerResilienceActions";
export {
  getGlobalTempUnschedulableSettings,
  getOverloadCooldownSettings,
  getRateLimit429CooldownSettings,
} from "./adminSchedulerResilienceQueries";
export type {
  GlobalTempUnschedulableSettings,
  OverloadCooldownSettings,
  RateLimit429CooldownSettings,
} from "../dtos/adminSchedulerResilienceDtos";
export { updateStreamTimeoutSettings } from "./adminStreamTimeoutActions";
export { getStreamTimeoutSettings } from "./adminStreamTimeoutQueries";
export type { StreamTimeoutSettings } from "../dtos/adminStreamTimeoutDtos";
export { updateSettings } from "./adminSystemSettingsActions";
export { getSettings } from "./adminSystemSettingsQueries";
export type {
  ClientIPResolutionMode,
  ClientIPResolutionStatus,
  OpenAIFastPolicyRule,
  OpenAIFastPolicySettings,
  SystemSettings,
  UpdateSettingsRequest,
} from "../dtos/adminSystemSettingsDtos";
/**
 * Test SMTP connection request
 */
export interface TestSmtpRequest {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_use_tls: boolean;
}

/**
 * Test SMTP connection with provided config
 * @param config - SMTP configuration to test
 * @returns Test result message
 */
export async function testSmtpConnection(
  config: TestSmtpRequest,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    "/admin/settings/test-smtp",
    config,
  );
  return data;
}

/**
 * Send test email request
 */
export interface SendTestEmailRequest {
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_use_tls: boolean;
}

/**
 * Send test email with provided SMTP config
 * @param request - Email address and SMTP config
 * @returns Test result message
 */
export async function sendTestEmail(
  request: SendTestEmailRequest,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    "/admin/settings/send-test-email",
    request,
  );
  return data;
}

export const settingsAPI = {
  getSettings,
  updateSettings,
  testSmtpConnection,
  sendTestEmail,
  getEmailTemplates,
  getEmailTemplate,
  updateEmailTemplate,
  restoreOfficialEmailTemplate,
  previewEmailTemplate,
  getAdminApiKey,
  regenerateAdminApiKey,
  deleteAdminApiKey,
  listAdminApiKeys,
  createAdminApiKey,
  updateAdminApiKey,
  rotateAdminApiKey,
  revokeAdminApiKey,
  getOverloadCooldownSettings,
  updateOverloadCooldownSettings,
  getRateLimit429CooldownSettings,
  updateRateLimit429CooldownSettings,
  getGlobalTempUnschedulableSettings,
  updateGlobalTempUnschedulableSettings,
  getPanelRateLimitSettings,
  updatePanelRateLimitSettings,
  getStreamTimeoutSettings,
  updateStreamTimeoutSettings,
  getRectifierSettings,
  updateRectifierSettings,
  getBetaPolicySettings,
  updateBetaPolicySettings,
  getWebSearchEmulationConfig,
  updateWebSearchEmulationConfig,
  testWebSearchEmulation,
  resetWebSearchUsage,
};

export default settingsAPI;

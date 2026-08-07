import type { Ref } from "vue";
import type {
  OpenAIFastPolicyRule,
  SystemSettings,
} from "@/features/admin-settings/data/dtos/adminSystemSettingsDtos";
import type { SettingsForm } from "./settingsForm";

interface SettingsSaveResponseContext {
  form: SettingsForm;
  updated: SystemSettings;
  smtpPasswordManuallyEdited: Ref<boolean>;
  openaiFastPolicyForm: { rules: OpenAIFastPolicyRule[] };
  openaiFastPolicyLoaded: Ref<boolean>;
  refreshStructuredEditors: () => void;
}

export function applySettingsSaveResponse({
  form,
  updated,
  smtpPasswordManuallyEdited,
  openaiFastPolicyForm,
  openaiFastPolicyLoaded,
  refreshStructuredEditors,
}: SettingsSaveResponseContext): void {
  for (const [key, value] of Object.entries(updated)) {
    if (key === "openai_fast_policy_settings") continue;
    if (value !== null && value !== undefined) {
      (form as unknown as Record<string, unknown>)[key] = value;
    }
  }

  form.smtp_password = "";
  smtpPasswordManuallyEdited.value = false;
  refreshStructuredEditors();

  if (
    updated.openai_fast_policy_settings &&
    Array.isArray(updated.openai_fast_policy_settings.rules)
  ) {
    openaiFastPolicyForm.rules =
      updated.openai_fast_policy_settings.rules.map((rule) => ({
        ...rule,
        model_whitelist: rule.model_whitelist
          ? [...rule.model_whitelist]
          : [],
      }));
    openaiFastPolicyLoaded.value = true;
  }
}

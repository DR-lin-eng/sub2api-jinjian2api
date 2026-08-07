import { computed, ref } from "vue";
import type { SettingsForm } from "./settingsForm";

type Translate = (key: string) => string;

export function useSettingsClientIPAccess(
  form: SettingsForm,
  t: Translate,
) {
  const clientIPTrustedProxiesText = ref("");

  const clientIPResolutionModeOptions = computed(() => [
    {
      value: "auto_compat",
      label: t("admin.settings.apiKeyAcl.modes.auto_compat"),
    },
    {
      value: "trusted_proxy",
      label: t("admin.settings.apiKeyAcl.modes.trusted_proxy"),
    },
    {
      value: "direct",
      label: t("admin.settings.apiKeyAcl.modes.direct"),
    },
  ]);

  const clientIPLastRefreshText = computed(() => {
    const raw = form.client_ip_resolution_status.cloudflare_last_success_at;
    if (!raw) return "";
    const value = new Date(raw);
    return Number.isNaN(value.getTime()) ? raw : value.toLocaleString();
  });

  function parseClientIPTrustedProxies(value: string): string[] {
    return Array.from(
      new Set(
        value
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }

  return {
    clientIPLastRefreshText,
    clientIPResolutionModeOptions,
    clientIPTrustedProxiesText,
    parseClientIPTrustedProxies,
  };
}

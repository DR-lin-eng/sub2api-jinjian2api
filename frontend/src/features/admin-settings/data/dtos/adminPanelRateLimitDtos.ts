/**
 * Panel API rate limit settings. Authenticated routes are limited per user;
 * public routes are limited per publicly routable client IP.
 */
export interface PanelRateLimitSettings {
  enabled: boolean;
  user_rpm: number;
  heavy_rpm: number;
  exempt_admin: boolean;
  public_ip_rpm: number;
}

export const DEFAULT_PANEL_RATE_LIMIT_SETTINGS: Readonly<PanelRateLimitSettings> =
  Object.freeze({
    enabled: false,
    user_rpm: 240,
    heavy_rpm: 60,
    exempt_admin: true,
    public_ip_rpm: 300,
  });

const PANEL_RATE_LIMIT_RPM_MAX = 100000;

function normalizePanelRate(value: unknown, fallback: number): number {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= PANEL_RATE_LIMIT_RPM_MAX
    ? value
    : fallback;
}

export function normalizePanelRateLimitSettings(
  input: unknown,
): PanelRateLimitSettings {
  const value =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  return {
    enabled: value.enabled === true,
    user_rpm: normalizePanelRate(
      value.user_rpm,
      DEFAULT_PANEL_RATE_LIMIT_SETTINGS.user_rpm,
    ),
    heavy_rpm: normalizePanelRate(
      value.heavy_rpm,
      DEFAULT_PANEL_RATE_LIMIT_SETTINGS.heavy_rpm,
    ),
    exempt_admin:
      typeof value.exempt_admin === "boolean"
        ? value.exempt_admin
        : DEFAULT_PANEL_RATE_LIMIT_SETTINGS.exempt_admin,
    public_ip_rpm: normalizePanelRate(
      value.public_ip_rpm,
      DEFAULT_PANEL_RATE_LIMIT_SETTINGS.public_ip_rpm,
    ),
  };
}

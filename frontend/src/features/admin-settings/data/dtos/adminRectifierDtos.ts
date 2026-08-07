export type ThinkingDisplayMode = "off" | "display_only" | "force";

export interface RectifierSettings {
  enabled: boolean;
  thinking_signature_enabled: boolean;
  thinking_budget_enabled: boolean;
  thinking_display_mode: ThinkingDisplayMode;
  apikey_signature_enabled: boolean;
  apikey_signature_patterns: string[];
}

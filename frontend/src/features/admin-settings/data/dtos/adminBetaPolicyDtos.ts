export type BetaPolicyAction = "pass" | "filter" | "block";

export type BetaPolicyScope = "all" | "oauth" | "apikey" | "bedrock";

export interface BetaPolicyRule {
  beta_token: string;
  action: BetaPolicyAction;
  scope: BetaPolicyScope;
  error_message?: string;
  model_whitelist?: string[];
  fallback_action?: BetaPolicyAction;
  fallback_error_message?: string;
}

export interface BetaPolicySettings {
  rules: BetaPolicyRule[];
}

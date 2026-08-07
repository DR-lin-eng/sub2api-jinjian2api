export interface WebSearchProviderConfig {
  type: "brave" | "tavily";
  api_key: string;
  api_key_configured: boolean;
  quota_limit: number | null;
  subscribed_at: number | null;
  quota_used?: number;
  proxy_id: number | null;
  expires_at: number | null;
}

export interface WebSearchEmulationConfig {
  enabled: boolean;
  providers: WebSearchProviderConfig[];
}

export interface WebSearchResult {
  url: string;
  title: string;
  snippet: string;
  page_age?: string;
}

export interface WebSearchTestResult {
  provider: string;
  results: WebSearchResult[];
  query: string;
}

export interface ResetWebSearchUsageRequest {
  provider_type: string;
}

export interface CreateCompositeRouteRequest {
  public_model: string
  match_type: 'exact' | 'prefix'
  target_platform: 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok'
  upstream_model?: string
  endpoint: 'any' | 'messages' | 'count_tokens' | 'responses' | 'chat_completions' | 'embeddings' | 'images' | 'gemini'
  priority?: number
  enabled?: boolean
  notes?: string
}

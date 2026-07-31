export interface PreviewCompositeRouteRequest {
  model: string
  endpoint: 'any' | 'messages' | 'count_tokens' | 'responses' | 'chat_completions' | 'embeddings' | 'images' | 'gemini'
}

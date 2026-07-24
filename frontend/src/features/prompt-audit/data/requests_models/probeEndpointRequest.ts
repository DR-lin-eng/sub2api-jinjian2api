export interface ProbeEndpointRequest {
  endpoint: {
    id: string
    name: string
    protocol: 'openai_compatible'
    base_url: string
    model: string
    token?: string
    timeout_ms: number
    input_limit: number
    enabled: boolean
  }
}

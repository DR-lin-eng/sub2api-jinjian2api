import type { WebSearchProviderConfig } from './webSearchProviderConfig'

export class WebSearchEmulationConfig {
  enabled!: boolean
  providers!: WebSearchProviderConfig[]
}

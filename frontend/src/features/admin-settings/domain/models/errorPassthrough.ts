export interface ErrorPassthroughRule {
  id: number
  name: string
  enabled: boolean
  priority: number
  errorCodes: number[]
  keywords: string[]
  matchMode: 'any' | 'all'
  platforms: string[]
  passthroughCode: boolean
  responseCode: number | null
  passthroughBody: boolean
  customMessage: string | null
  skipMonitoring: boolean
  description: string | null
  createdAt: string
  updatedAt: string
}

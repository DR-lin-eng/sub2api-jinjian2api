import type { MethodLimit } from './methodLimit'

export class MethodLimitsResponse {
  methods!: Record<string, MethodLimit>
  globalMin!: number
  globalMax!: number
}

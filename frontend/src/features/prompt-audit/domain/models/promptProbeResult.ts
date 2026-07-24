export class PromptProbeResult {
  ok!: boolean
  status!: string
  errorCode?: string
  message!: string
  latencyMs!: number
  httpStatus!: number
  retryable!: boolean
  checkedAt!: string
  tokenApplied!: boolean
}

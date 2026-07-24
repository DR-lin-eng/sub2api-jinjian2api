import { OpsThroughputTrendPoint } from './opsThroughputTrendPoint'
import { OpsThroughputPlatformBreakdown } from './opsThroughputPlatformBreakdown'
import { OpsThroughputGroupBreakdown } from './opsThroughputGroupBreakdown'

export class OpsThroughputTrendResponse {
  bucket!: string
  points!: OpsThroughputTrendPoint[]
  byPlatform!: OpsThroughputPlatformBreakdown[]
  topGroups!: OpsThroughputGroupBreakdown[]
}

import type { ModelPlazaModel } from './modelPlazaModel'

export class ModelPlazaGroup {
  id!: number
  name!: string
  description!: string
  platform!: string
  subscriptionType!: string
  rateMultiplier!: number
  userRateMultiplier?: number
  peakRateEnabled!: boolean
  peakStart!: string
  peakEnd!: string
  peakRateMultiplier!: number
  isExclusive!: boolean
  models!: ModelPlazaModel[]
}

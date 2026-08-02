import type { ModelPlazaPricingInterval } from './modelPlazaPricingInterval'

export class ModelPlazaPricing {
  billingMode!: string
  inputPrice!: number | null
  outputPrice!: number | null
  cacheWritePrice!: number | null
  cacheReadPrice!: number | null
  imageInputPrice!: number | null
  imageOutputPrice!: number | null
  perRequestPrice!: number | null
  intervals!: ModelPlazaPricingInterval[]
}

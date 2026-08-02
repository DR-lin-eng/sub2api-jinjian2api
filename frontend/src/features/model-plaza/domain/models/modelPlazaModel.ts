import type { ModelPlazaOfficialPricing } from './modelPlazaOfficialPricing'
import type { ModelPlazaPricing } from './modelPlazaPricing'

export class ModelPlazaModel {
  name!: string
  platform!: string
  pricing!: ModelPlazaPricing | null
  officialPricing!: ModelPlazaOfficialPricing | null
}

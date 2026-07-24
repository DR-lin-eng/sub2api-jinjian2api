import { OpsErrorTrendPoint } from './opsErrorTrendPoint'

export class OpsErrorTrendResponse {
  bucket!: string
  points!: OpsErrorTrendPoint[]
}

import { UserErrorRequest } from './userErrorRequest'

export class UserErrorRequestDetail extends UserErrorRequest {
  errorBody!: string
  upstreamStatusCode!: number | null
}

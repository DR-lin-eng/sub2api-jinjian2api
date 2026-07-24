import type { UserAuthProvider } from './userAuthProvider'

export class UserProfileSourceContext {
  provider!: UserAuthProvider | string
  source!: string
  label!: string
  providerLabel!: string
}

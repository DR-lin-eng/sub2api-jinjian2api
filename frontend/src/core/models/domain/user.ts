import type { UserAuthProvider } from './userAuthProvider'
import type { UserAuthBindingStatus } from './userAuthBindingStatus'
import type { UserProfileSourceContext } from './userProfileSourceContext'
import type { NotifyEmailEntry } from './notifyEmailEntry'

export class User {
  id!: number
  username!: string
  email!: string
  role!: 'admin' | 'user'
  balance!: number
  concurrency!: number
  status!: 'active' | 'disabled'
  balanceNotifyEnabled!: boolean
  createdAt!: string
  updatedAt!: string
  balanceNotifyThreshold?: number | null
  balanceNotifyExtraEmails?: NotifyEmailEntry[]
  frozenBalance?: number
  rpmLimit?: number
  allowedGroups?: number[] | null
  lastActiveAt?: string | null
  deletedAt?: string | null
  avatarUrl?: string | null
  avatarSource?: string | UserProfileSourceContext | null
  usernameSource?: string | UserProfileSourceContext | null
  displayNameSource?: string | UserProfileSourceContext | null
  nicknameSource?: string | UserProfileSourceContext | null
  profileSources?: {
    avatar?: string | UserProfileSourceContext | null
    username?: string | UserProfileSourceContext | null
    displayName?: string | UserProfileSourceContext | null
    nickname?: string | UserProfileSourceContext | null
  }
  authBindings?: Partial<Record<UserAuthProvider, boolean | UserAuthBindingStatus>>
  identityBindings?: Partial<Record<UserAuthProvider, boolean | UserAuthBindingStatus>>
  emailBound?: boolean
  linuxdoBound?: boolean
  oidcBound?: boolean
  wechatBound?: boolean
}

import { User } from '@/core/models/domain/user'

export class CurrentUserResponse extends User {
  runMode?: 'standard' | 'simple'
}

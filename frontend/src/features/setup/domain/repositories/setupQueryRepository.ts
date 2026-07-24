import type { SetupStatus } from '@/features/setup/domain/models/setupStatus'

export interface SetupQueryRepository {
  getSetupStatus(): Promise<SetupStatus>
}

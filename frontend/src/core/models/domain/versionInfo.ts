import type { ReleaseInfo } from './releaseInfo'

export class VersionInfo {
  currentVersion!: string
  latestVersion!: string
  hasUpdate!: boolean
  releaseInfo?: ReleaseInfo
  cached!: boolean
  warning?: string
  buildType!: string
}

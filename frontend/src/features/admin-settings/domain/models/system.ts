export interface ReleaseInfo {
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

export interface VersionInfo {
  currentVersion: string
  latestVersion: string
  hasUpdate: boolean
  releaseInfo?: ReleaseInfo
  cached: boolean
  warning?: string
  buildType: string
}

export interface RollbackVersionInfo {
  version: string
  publishedAt: string
  htmlUrl: string
}

export interface UpdateResult {
  message: string
  needRestart: boolean
}

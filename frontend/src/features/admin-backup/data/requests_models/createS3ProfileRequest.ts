export interface CreateS3ProfileRequest {
  profile_id: string
  name: string
  enabled: boolean
  endpoint: string
  region: string
  bucket: string
  access_key_id: string
  secret_access_key?: string
  prefix?: string
  force_path_style?: boolean
  use_ssl?: boolean
  set_active?: boolean
}

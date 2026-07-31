export class ClientIpResolutionStatus {
  mode!: 'auto_compat' | 'trusted_proxy' | 'direct'
  customPrefixCount!: number
  staticPrefixCount!: number
  cloudflarePrefixCount!: number
  cloudflareRangesSource!: 'embedded' | 'refreshed'
  cloudflareLastSuccessAt!: string | null
}

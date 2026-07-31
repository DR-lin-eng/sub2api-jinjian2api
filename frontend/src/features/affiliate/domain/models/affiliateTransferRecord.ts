export class AffiliateTransferRecord {
  ledgerId!: number
  userId!: number
  userEmail!: string
  username!: string
  amount!: number
  balanceAfter!: number | null
  availableQuotaAfter!: number | null
  frozenQuotaAfter!: number | null
  historyQuotaAfter!: number | null
  snapshotAvailable!: boolean
  createdAt!: string
}

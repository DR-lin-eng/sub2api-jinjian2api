export const ACCOUNT_SORT_STORAGE_KEY = 'account-table-sort'

export type AccountSortOrder = 'asc' | 'desc'

export type AccountSortState = {
  sort_by: string
  sort_order: AccountSortOrder
}

const accountSortableKeys = new Set([
  'id',
  'name',
  'status',
  'schedulable',
  'priority',
  'rate_multiplier',
  'upstream_billing_rate',
  'last_used_at',
  'created_at',
  'expires_at',
])

const fallbackSortState = (): AccountSortState => ({
  sort_by: 'name',
  sort_order: 'asc',
})

export const loadInitialAccountSortState = (
  storage: Pick<Storage, 'getItem'> = localStorage,
): AccountSortState => {
  try {
    const raw = storage.getItem(ACCOUNT_SORT_STORAGE_KEY)
    if (!raw) return fallbackSortState()

    const parsed = JSON.parse(raw) as { key?: string; order?: string }
    const key = typeof parsed.key === 'string' ? parsed.key : ''
    if (!accountSortableKeys.has(key)) return fallbackSortState()

    return {
      sort_by: key,
      sort_order: parsed.order === 'desc' ? 'desc' : 'asc',
    }
  } catch {
    return fallbackSortState()
  }
}

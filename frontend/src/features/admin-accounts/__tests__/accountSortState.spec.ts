import {
  ACCOUNT_SORT_STORAGE_KEY,
  loadInitialAccountSortState,
} from '@/features/admin-accounts/presentation/accountSortState'

const storageWith = (value: string | null): Pick<Storage, 'getItem'> => ({
  getItem: vi.fn((key: string) => key === ACCOUNT_SORT_STORAGE_KEY ? value : null),
})

describe('account sort state', () => {
  it('uses the stable fallback when no preference exists', () => {
    expect(loadInitialAccountSortState(storageWith(null))).toEqual({
      sort_by: 'name',
      sort_order: 'asc',
    })
  })

  it('rejects malformed or unsupported preferences', () => {
    expect(loadInitialAccountSortState(storageWith('{'))).toEqual({
      sort_by: 'name',
      sort_order: 'asc',
    })
    expect(loadInitialAccountSortState(storageWith(JSON.stringify({ key: 'secret' })))).toEqual({
      sort_by: 'name',
      sort_order: 'asc',
    })
  })

  it('restores an allowed key and normalizes the order', () => {
    expect(
      loadInitialAccountSortState(storageWith(JSON.stringify({ key: 'priority', order: 'desc' }))),
    ).toEqual({
      sort_by: 'priority',
      sort_order: 'desc',
    })
    expect(
      loadInitialAccountSortState(storageWith(JSON.stringify({ key: 'created_at', order: 'sideways' }))),
    ).toEqual({
      sort_by: 'created_at',
      sort_order: 'asc',
    })
  })
})

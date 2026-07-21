/**
 * AdminClusterRepository (interface). Auto-generated from adminClusterDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminClusterRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-cluster/data/datasources/adminClusterDatasource'

export type AdminClusterRepository = {
  getClusterStatus: typeof ds.getClusterStatus
}

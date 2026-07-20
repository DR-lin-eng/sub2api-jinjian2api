/**
 * @deprecated Import from './data/datasources/promptAudit{Query,Action}Datasource' directly.
 * This aggregate barrel preserves the pre-Wave-5 shape (`promptAuditAPI`) so that
 * the migration can proceed in phases without breaking widgets. It will be removed
 * once presentation refactors to consume the split datasources directly.
 */
import { promptAuditQueryAPI } from './data/datasources/promptAuditQueryDatasource'
import { promptAuditActionAPI } from './data/datasources/promptAuditActionDatasource'

export * from './data/datasources/promptAuditQueryDatasource'
export * from './data/datasources/promptAuditActionDatasource'

export const promptAuditAPI = {
  ...promptAuditQueryAPI,
  ...promptAuditActionAPI,
}

export default promptAuditAPI

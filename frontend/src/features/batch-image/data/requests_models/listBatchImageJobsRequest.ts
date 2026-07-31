export interface ListBatchImageJobsRequest {
  limit?: number
  cursor?: string
  status?: string
  taskName?: string
  downloaded?: '' | 'true' | 'false' | string
  from?: string
  to?: string
}

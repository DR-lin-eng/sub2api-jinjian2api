export interface GetOrdersRequest {
  page?: number
  page_size?: number
  status?: string
  payment_type?: string
  user_id?: number
  keyword?: string
  start_date?: string
  end_date?: string
  order_type?: string
}

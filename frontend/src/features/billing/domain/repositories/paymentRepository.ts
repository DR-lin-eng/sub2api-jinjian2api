/**
 * PaymentRepository (interface). Uses typeof to reuse the datasource shape.
 */
import type { paymentAPI } from '@/features/billing/data/datasources/paymentDatasource'

export type PaymentRepository = typeof paymentAPI

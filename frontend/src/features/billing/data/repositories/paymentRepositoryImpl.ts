/**
 * PaymentRepositoryImpl. Wraps the datasource paymentAPI singleton.
 */
import { paymentAPI } from '@/features/billing/data/datasources/paymentDatasource'
import type { PaymentRepository } from '@/features/billing/domain/repositories/paymentRepository'

export const paymentRepository: PaymentRepository = paymentAPI

/**
 * useAdminChannelMonitor — lightweight aggregator per spec §8.
 * Hand-written; the .tmp_gen_composables.mjs generator only overwrites
 * files that begin with its exact AUTO_GEN_HEADER, so this stays put.
 */
import { useAdminChannelMonitorQueryStore } from '@/features/admin-channel-monitor/presentation/stores/adminChannelMonitorQueryStore'
import { useAdminChannelMonitorActionStore } from '@/features/admin-channel-monitor/presentation/stores/adminChannelMonitorActionStore'

export function useAdminChannelMonitor() {
  const query = useAdminChannelMonitorQueryStore()
  const action = useAdminChannelMonitorActionStore()
  return {
    ...query,
    ...action,
  }
}

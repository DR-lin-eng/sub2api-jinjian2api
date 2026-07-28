import { onMounted, onUnmounted } from 'vue'

interface RiskControlPollingOptions {
  loadInitial: () => void | Promise<void>
  refreshStatus: (silent: boolean) => void | Promise<void>
  intervalMs?: number
}

export function useRiskControlPolling({
  loadInitial,
  refreshStatus,
  intervalMs = 15_000,
}: RiskControlPollingOptions): void {
  let statusTimer: number | null = null

  onMounted(() => {
    void loadInitial()
    statusTimer = window.setInterval(() => {
      void refreshStatus(true)
    }, intervalMs)
  })

  onUnmounted(() => {
    if (statusTimer !== null) {
      window.clearInterval(statusTimer)
      statusTimer = null
    }
  })
}

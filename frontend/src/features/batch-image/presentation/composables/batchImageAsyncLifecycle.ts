export interface BatchImageGenerationSnapshot {
  readonly generation: number
  readonly owner: string
}

export function createBatchImageGenerationScope() {
  let generation = 0
  let disposed = false

  return {
    capture(owner: string): BatchImageGenerationSnapshot {
      return { generation, owner }
    },
    invalidate() {
      generation += 1
    },
    isCurrent(snapshot: BatchImageGenerationSnapshot, owner: string) {
      return !disposed
        && snapshot.generation === generation
        && snapshot.owner === owner
    },
    dispose() {
      disposed = true
      generation += 1
    },
  }
}

interface BatchImageLatestSingleFlightOptions<T> {
  key: (request: T) => string
  isCurrent: (request: T) => boolean
  run: (request: T) => Promise<void>
  onBusyChange?: (busy: boolean) => void
}

export function createBatchImageLatestSingleFlight<T>(
  options: BatchImageLatestSingleFlightOptions<T>,
) {
  let activeKey = ''
  let activePromise: Promise<void> | null = null
  let pendingRequest: T | null = null

  const takePendingRequest = () => {
    const request = pendingRequest
    pendingRequest = null
    return request
  }

  const drain = async (initialRequest: T) => {
    let request: T | null = initialRequest
    try {
      while (request) {
        if (!options.isCurrent(request)) {
          request = takePendingRequest()
          continue
        }
        activeKey = options.key(request)
        await options.run(request)
        request = takePendingRequest()
      }
    } finally {
      activeKey = ''
      activePromise = null
      pendingRequest = null
      options.onBusyChange?.(false)
    }
  }

  return {
    request(request: T): Promise<void> {
      if (!options.isCurrent(request)) return Promise.resolve()
      if (activePromise) {
        if (options.key(request) !== activeKey) {
          pendingRequest = request
        }
        return activePromise
      }

      activeKey = options.key(request)
      options.onBusyChange?.(true)
      activePromise = drain(request)
      return activePromise
    },
    clearPending() {
      pendingRequest = null
    },
    isRunning() {
      return activePromise !== null
    },
  }
}

export interface BatchImageObjectURLAPI {
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
}

export function replaceBatchImageObjectURL(
  urls: Record<string, string>,
  key: string,
  blob: Blob,
  isCurrent: () => boolean,
  urlAPI: BatchImageObjectURLAPI = URL,
) {
  const url = urlAPI.createObjectURL(blob)
  if (!isCurrent()) {
    urlAPI.revokeObjectURL(url)
    return false
  }

  const previousURL = urls[key]
  if (previousURL && previousURL !== url) {
    urlAPI.revokeObjectURL(previousURL)
  }
  urls[key] = url
  return true
}

export function revokeBatchImageObjectURLs(
  urls: Record<string, string>,
  urlAPI: Pick<BatchImageObjectURLAPI, 'revokeObjectURL'> = URL,
) {
  for (const url of Object.values(urls)) {
    if (url) urlAPI.revokeObjectURL(url)
  }
  for (const key of Object.keys(urls)) {
    delete urls[key]
  }
}

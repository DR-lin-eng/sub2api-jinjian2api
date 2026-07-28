type PreviewCacheRecord = {
  key: string
  blob: Blob
  size: number
  createdAt: number
  lastAccessedAt: number
}

type PreviewImageSource = ImageBitmap | HTMLImageElement

const PREVIEW_CACHE_DB_NAME = 'sub2api-batch-image-preview-cache'
const PREVIEW_CACHE_STORE_NAME = 'thumbnails'
const PREVIEW_THUMBNAIL_MAX_EDGE = 360
const PREVIEW_THUMBNAIL_QUALITY = 0.72
const PREVIEW_CACHE_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000
const PREVIEW_CACHE_MAX_ENTRIES = 120
const PREVIEW_CACHE_MAX_BYTES = 48 * 1024 * 1024

export function batchImagePreviewCacheKey(
  batchId: string,
  customID: string,
  imageIndex = 0,
) {
  return [batchId, customID, imageIndex]
    .map(part => encodeURIComponent(String(part)))
    .join(':')
}

export function createBatchImagePreviewCache() {
  let dbPromise: Promise<IDBDatabase | null> | null = null

  const isSupported = () => typeof window !== 'undefined' && 'indexedDB' in window

  const idbRequest = <T>(request: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

  const openDB = (): Promise<IDBDatabase | null> => {
    if (!isSupported()) return Promise.resolve(null)
    if (dbPromise) return dbPromise

    dbPromise = new Promise((resolve) => {
      const request = window.indexedDB.open(PREVIEW_CACHE_DB_NAME, 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(PREVIEW_CACHE_STORE_NAME)) {
          const store = db.createObjectStore(PREVIEW_CACHE_STORE_NAME, { keyPath: 'key' })
          store.createIndex('lastAccessedAt', 'lastAccessedAt', { unique: false })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    })
    return dbPromise
  }

  const touch = async (cacheKey: string, lastAccessedAt: number) => {
    const db = await openDB()
    if (!db) return
    const record = await idbRequest<PreviewCacheRecord | undefined>(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readonly')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .get(cacheKey),
    ).catch(() => undefined)
    if (!record) return
    record.lastAccessedAt = lastAccessedAt
    await idbRequest(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readwrite')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .put(record),
    ).catch(() => null)
  }

  const remove = async (cacheKey: string) => {
    const db = await openDB()
    if (!db) return
    await idbRequest(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readwrite')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .delete(cacheKey),
    ).catch(() => null)
  }

  const get = async (cacheKey: string): Promise<Blob | null> => {
    const db = await openDB()
    if (!db) return null
    const record = await idbRequest<PreviewCacheRecord | undefined>(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readonly')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .get(cacheKey),
    ).catch(() => undefined)
    if (!record?.blob) return null

    const now = Date.now()
    if (now - record.createdAt > PREVIEW_CACHE_MAX_AGE_MS) {
      void remove(cacheKey)
      return null
    }
    void touch(cacheKey, now)
    return record.blob
  }

  const cleanup = async () => {
    const db = await openDB()
    if (!db) return
    const records = await idbRequest<PreviewCacheRecord[]>(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readonly')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .getAll(),
    ).catch(() => [])
    if (!records.length) return

    const now = Date.now()
    const sorted = [...records].sort((a, b) => a.lastAccessedAt - b.lastAccessedAt)
    const deleteKeys = new Set<string>()
    let totalBytes = 0
    let keptCount = 0

    for (const record of sorted) {
      if (now - record.createdAt > PREVIEW_CACHE_MAX_AGE_MS) {
        deleteKeys.add(record.key)
        continue
      }
      totalBytes += record.size || record.blob?.size || 0
      keptCount += 1
    }

    for (const record of sorted) {
      if (deleteKeys.has(record.key)) continue
      if (keptCount <= PREVIEW_CACHE_MAX_ENTRIES && totalBytes <= PREVIEW_CACHE_MAX_BYTES) break
      deleteKeys.add(record.key)
      totalBytes -= record.size || record.blob?.size || 0
      keptCount -= 1
    }

    if (!deleteKeys.size) return
    const store = db.transaction(PREVIEW_CACHE_STORE_NAME, 'readwrite')
      .objectStore(PREVIEW_CACHE_STORE_NAME)
    for (const key of deleteKeys) store.delete(key)
  }

  const put = async (cacheKey: string, blob: Blob) => {
    const db = await openDB()
    if (!db) return
    const now = Date.now()
    const record: PreviewCacheRecord = {
      key: cacheKey,
      blob,
      size: blob.size,
      createdAt: now,
      lastAccessedAt: now,
    }
    await idbRequest(
      db.transaction(PREVIEW_CACHE_STORE_NAME, 'readwrite')
        .objectStore(PREVIEW_CACHE_STORE_NAME)
        .put(record),
    ).catch(() => null)
    void cleanup()
  }

  const loadImageSource = async (blob: Blob): Promise<{
    image: PreviewImageSource
    width: number
    height: number
    close: () => void
  }> => {
    if ('createImageBitmap' in window) {
      const bitmap = await window.createImageBitmap(blob)
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      }
    }

    const url = URL.createObjectURL(blob)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('image unavailable'))
        img.src = url
      })
      return {
        image,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        close: () => URL.revokeObjectURL(url),
      }
    } catch (error) {
      URL.revokeObjectURL(url)
      throw error
    }
  }

  const createThumbnail = async (blob: Blob): Promise<Blob> => {
    const source = await loadImageSource(blob)
    let sourceClosed = false
    const closeSource = () => {
      if (sourceClosed) return
      sourceClosed = true
      source.close()
    }
    try {
      const scale = Math.min(
        1,
        PREVIEW_THUMBNAIL_MAX_EDGE / Math.max(source.width, source.height),
      )
      const targetWidth = Math.max(1, Math.round(source.width * scale))
      const targetHeight = Math.max(1, Math.round(source.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas unavailable')
      ctx.drawImage(source.image, 0, 0, targetWidth, targetHeight)
      closeSource()
      return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((thumbnail) => {
          if (thumbnail) resolve(thumbnail)
          else reject(new Error('thumbnail unavailable'))
        }, 'image/webp', PREVIEW_THUMBNAIL_QUALITY)
      })
    } finally {
      closeSource()
    }
  }

  return {
    isSupported,
    key: batchImagePreviewCacheKey,
    get,
    put,
    cleanup,
    createThumbnail,
  }
}

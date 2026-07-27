let activeLocks = 0
let previousOverflow: string | null = null

/**
 * Locks body scrolling until every owner has released its lock. The first
 * owner preserves any pre-existing inline overflow value for the last owner
 * to restore.
 */
export function acquireBodyScrollLock(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (activeLocks === 0) {
    previousOverflow = document.body.style.overflow
  }
  activeLocks += 1
  document.body.style.overflow = 'hidden'

  let released = false
  return () => {
    if (released) return
    released = true
    activeLocks = Math.max(0, activeLocks - 1)
    if (activeLocks !== 0) return

    document.body.style.overflow = previousOverflow ?? ''
    previousOverflow = null
  }
}

import { reactive } from 'vue'

interface BatchImagePromptPopoverOptions {
  copy: (text: string) => void
}

export function useBatchImagePromptPopover(options: BatchImagePromptPopoverOptions) {
  const promptPopover = reactive({
    visible: false,
    text: '',
    style: {} as Record<string, string>,
  })
  let closeTimer: ReturnType<typeof setTimeout> | null = null
  let openTimer: ReturnType<typeof setTimeout> | null = null
  let activeTarget: HTMLElement | null = null

  const cancelPromptPopoverClose = () => {
    if (!closeTimer) return
    clearTimeout(closeTimer)
    closeTimer = null
  }

  const cancelPromptPopoverOpen = () => {
    if (!openTimer) return
    clearTimeout(openTimer)
    openTimer = null
  }

  const closePromptPopover = () => {
    cancelPromptPopoverOpen()
    cancelPromptPopoverClose()
    promptPopover.visible = false
    promptPopover.text = ''
    promptPopover.style = {}
    activeTarget = null
  }

  const openPromptPopover = (target: HTMLElement, value: string) => {
    const rect = target.getBoundingClientRect()
    if (!rect) return
    const viewportWidth = window.innerWidth || 1280
    const viewportHeight = window.innerHeight || 720
    const width = Math.min(440, Math.max(320, viewportWidth - 32))
    const left = Math.max(16, Math.min(rect.left, viewportWidth - width - 16))
    const estimatedHeight = 178
    const preferredTop = rect.bottom + 8
    const top = preferredTop + estimatedHeight > viewportHeight
      ? Math.max(16, rect.top - estimatedHeight - 8)
      : preferredTop
    promptPopover.text = value
    promptPopover.style = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
    }
    promptPopover.visible = true
  }

  const schedulePromptPopoverClose = () => {
    cancelPromptPopoverOpen()
    cancelPromptPopoverClose()
    closeTimer = setTimeout(() => {
      closePromptPopover()
    }, 180)
  }

  const schedulePromptPopoverOpen = (
    event: MouseEvent | PointerEvent,
    text: string,
  ) => {
    const target = event.currentTarget as HTMLElement | null
    if (!target) return
    const value = String(text || '').trim()
    if (!value || value === '-') return
    activeTarget = target
    cancelPromptPopoverOpen()
    cancelPromptPopoverClose()
    openTimer = setTimeout(() => {
      if (activeTarget !== target || !document.body.contains(target)) return
      openPromptPopover(target, value)
    }, 520)
  }

  const showPromptPopover = (event: MouseEvent | FocusEvent, text: string) => {
    const value = String(text || '').trim()
    if (!value || value === '-') return
    const target = event.currentTarget as HTMLElement | null
    cancelPromptPopoverClose()
    cancelPromptPopoverOpen()
    if (!target) return
    activeTarget = target
    openPromptPopover(target, value)
  }

  const copyPromptPopover = () => {
    if (!promptPopover.text) return
    options.copy(promptPopover.text)
  }

  return {
    promptPopover,
    cancelPromptPopoverClose,
    closePromptPopover,
    schedulePromptPopoverClose,
    schedulePromptPopoverOpen,
    showPromptPopover,
    copyPromptPopover,
  }
}

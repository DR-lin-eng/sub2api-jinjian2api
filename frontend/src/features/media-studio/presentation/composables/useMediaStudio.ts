import { useMediaStudioQueryStore } from '@/features/media-studio/presentation/stores/mediaStudioQueryStore'

export function useMediaStudio() {
  const queryStore = useMediaStudioQueryStore()
  return { ...queryStore }
}

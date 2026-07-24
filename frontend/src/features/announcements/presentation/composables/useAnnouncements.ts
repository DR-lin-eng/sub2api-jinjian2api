import { useAnnouncementsQueryStore } from '@/features/announcements/presentation/stores/announcementsQueryStore'
import { useAnnouncementsActionStore } from '@/features/announcements/presentation/stores/announcementsActionStore'

export function useAnnouncements() {
  const q = useAnnouncementsQueryStore()
  const a = useAnnouncementsActionStore()
  return { ...q, ...a }
}

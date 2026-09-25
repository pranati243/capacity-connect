import { Bell, Trophy, Megaphone, FileText } from 'lucide-react'
import type { PublishType } from '../types'

export const PUBLISH_META: Record<
  PublishType,
  { icon: typeof Bell; tone: 'info' | 'success' | 'warning' | 'neutral'; label: string }
> = {
  notification: { icon: Bell, tone: 'warning', label: 'Notification' },
  announcement: { icon: Megaphone, tone: 'info', label: 'Announcement' },
  achievement: { icon: Trophy, tone: 'success', label: 'Achievement' },
  content: { icon: FileText, tone: 'neutral', label: 'New Content' },
}

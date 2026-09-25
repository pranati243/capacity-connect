import { PlayCircle, Presentation, FileText } from 'lucide-react'
import type { Resource } from '../types'

export const RESOURCE_ICON: Record<Resource['type'], typeof PlayCircle> = {
  lecture: PlayCircle,
  presentation: Presentation,
  material: FileText,
}

export const RESOURCE_LABEL: Record<Resource['type'], string> = {
  lecture: 'Recorded lecture',
  presentation: 'Presentation',
  material: 'Study material',
}

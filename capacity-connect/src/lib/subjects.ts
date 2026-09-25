import { Gauge, CloudSun, LineChart, Siren, Satellite, Scale, BookOpen, type LucideIcon } from 'lucide-react'

const SUBJECT_ICON: Record<string, LucideIcon> = {
  'Meteorological Instruments': Gauge,
  'Weather Forecasting Models': CloudSun,
  'Climate Data Analysis': LineChart,
  'Disaster Risk Communication': Siren,
  'Satellite & Radar Systems': Satellite,
  'Public Administration Ethics': Scale,
}

export function subjectIcon(subject: string): LucideIcon {
  return SUBJECT_ICON[subject] ?? BookOpen
}

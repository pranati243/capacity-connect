import type { Attempt, Course, Enrollment } from '../types'
import { SUBJECTS } from '../data/mockData'

const SUBJECT_SHORT: Record<string, string> = {
  'Meteorological Instruments': 'Instruments',
  'Weather Forecasting Models': 'Forecasting',
  'Climate Data Analysis': 'Climate Data',
  'Disaster Risk Communication': 'Disaster Comms',
  'Satellite & Radar Systems': 'Satellite/Radar',
  'Public Administration Ethics': 'Admin Ethics',
}

export const PASS_PCT = 60
export const TARGET_PCT = 75

export function pct(score: number, total: number) {
  return total === 0 ? 0 : Math.round((score / total) * 100)
}

export function bestAttemptPct(attempts: Attempt[], traineeId: string, courseId: string): number | null {
  const mine = attempts.filter((a) => a.traineeId === traineeId && a.courseId === courseId)
  if (mine.length === 0) return null
  return Math.max(...mine.map((a) => pct(a.score, a.total)))
}

export function isCertified(enrollment: Enrollment, course: Course | undefined, attempts: Attempt[]) {
  if (!course || enrollment.progress < 100) return false
  if (course.questionnaires.length === 0) return true
  const best = bestAttemptPct(attempts, enrollment.traineeId, course.id)
  return best !== null && best >= PASS_PCT
}

export function subjectScores(traineeId: string, courses: Course[], attempts: Attempt[]) {
  return SUBJECTS.map((subject) => {
    const subjectCourses = courses.filter((c) => c.subject === subject)
    const scores = subjectCourses
      .map((c) => bestAttemptPct(attempts, traineeId, c.id))
      .filter((s): s is number => s !== null)
    return {
      subject,
      short: SUBJECT_SHORT[subject] ?? subject,
      current: scores.length ? Math.max(...scores) : 0,
      target: TARGET_PCT,
    }
  })
}

export function certificateId(enrollmentId: string) {
  return `CC-2026-${enrollmentId.toUpperCase().replace(/[^A-Z0-9]/g, '')}`
}

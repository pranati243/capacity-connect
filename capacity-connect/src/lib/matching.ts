import type { AppUser, Attempt, CompetencyEntry, Course } from '../types'
import { pct, PASS_PCT } from './metrics'

export const MATCH_WEIGHTS = { competency: 0.6, rating: 0.25, passRate: 0.15 }

export interface TrainerMatch {
  trainer: AppUser
  entry: CompetencyEntry
  rating: number | null
  passRate: number | null
  match: number
}

function passRateFor(trainerId: string, courses: Course[], attempts: Attempt[]) {
  const ids = new Set(courses.filter((c) => c.trainerId === trainerId).map((c) => c.id))
  const at = attempts.filter((a) => ids.has(a.courseId))
  if (at.length === 0) return null
  return Math.round((at.filter((a) => pct(a.score, a.total) >= PASS_PCT).length / at.length) * 100)
}

// Missing rating/pass-rate data counts as a neutral 50 so new trainers are not ranked last by default.
export function rankTrainers(
  subject: string,
  trainers: AppUser[],
  competencyMap: CompetencyEntry[],
  courses: Course[],
  attempts: Attempt[],
  ratingFor: (trainerId: string) => number | null,
): TrainerMatch[] {
  return trainers
    .flatMap((trainer) => {
      const entry = competencyMap.find((e) => e.trainerId === trainer.id && e.subject === subject)
      if (!entry) return []
      const rating = ratingFor(trainer.id)
      const passRate = passRateFor(trainer.id, courses, attempts)
      const match = Math.round(
        entry.score * MATCH_WEIGHTS.competency +
          (rating !== null ? (rating / 5) * 100 : 50) * MATCH_WEIGHTS.rating +
          (passRate ?? 50) * MATCH_WEIGHTS.passRate,
      )
      return [{ trainer, entry, rating, passRate, match }]
    })
    .sort((a, b) => b.match - a.match)
}

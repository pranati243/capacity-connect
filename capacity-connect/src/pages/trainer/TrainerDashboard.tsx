import { Link } from 'react-router-dom'
import { Star, AlertTriangle, BookOpen, Users, Percent } from 'lucide-react'
import { Card, CardHeader, StatTile, Badge, EmptyState, ProgressBar } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { pct, PASS_PCT } from '../../lib/metrics'

export function TrainerDashboard() {
  const { currentUser, courses, enrollments, attempts, feedback, userById, trainerRatingFor } = useAppData()
  const me = currentUser!
  const myCourses = courses.filter((c) => c.trainerId === me.id)
  const myCourseIds = new Set(myCourses.map((c) => c.id))
  const myEnrollments = enrollments.filter((e) => myCourseIds.has(e.courseId))
  const myAttempts = attempts.filter((a) => myCourseIds.has(a.courseId))
  const myFeedback = feedback.filter((f) => myCourseIds.has(f.courseId))
  const avgScore = myAttempts.length
    ? Math.round(myAttempts.reduce((s, a) => s + pct(a.score, a.total), 0) / myAttempts.length)
    : 0
  const rating = trainerRatingFor(me.id)
  const today = new Date().toISOString().slice(0, 10)
  const openQuestionnaires = myCourses.flatMap((c) =>
    c.questionnaires.filter((q) => q.deadline >= today).map((q) => ({ q, c })),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={BookOpen} label="My Courses" value={myCourses.length} />
        <StatTile icon={Users} label="Enrolled Trainees" value={new Set(myEnrollments.map((e) => e.traineeId)).size} />
        <StatTile icon={Percent} label="Avg. Trainee Score" value={`${avgScore}%`} accent="green" />
        <StatTile icon={Star} label="Trainer Rating" value={rating ? `${rating.toFixed(1)} / 5` : '—'} accent="saffron" hint={`${myFeedback.length} reviews`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="My Courses" subtitle="Enrollment and completion at a glance" />
          <div className="divide-y divide-rule">
            {myCourses.length === 0 && <EmptyState text="No courses assigned yet." />}
            {myCourses.map((c) => {
              const en = myEnrollments.filter((e) => e.courseId === c.id)
              const avgProgress = en.length ? Math.round(en.reduce((s, e) => s + e.progress, 0) / en.length) : 0
              return (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{c.title}</p>
                      <p className="text-xs text-slate-500">{en.length} trainees · {c.resources.length} resources · {c.questionnaires.length} questionnaires</p>
                    </div>
                    <Badge tone="info">{c.level}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <ProgressBar value={avgProgress} />
                    <span className="text-xs text-slate-500 w-24 text-right">{avgProgress}% avg. done</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Open Questionnaires" action={<Link to="/trainer/questionnaires" className="text-sm text-navy font-medium">Manage</Link>} />
          <div className="p-4 space-y-3">
            {openQuestionnaires.length === 0 && <EmptyState text="No open questionnaires." />}
            {openQuestionnaires.map(({ q, c }) => {
              const submittedCount = myAttempts.filter((a) => a.questionnaireId === q.id).length
              const enrolledCount = myEnrollments.filter((e) => e.courseId === c.id).length
              return (
                <div key={q.id} className="p-3 rounded-lg border border-rule">
                  <p className="text-sm font-medium text-slate-800">{q.title}</p>
                  <p className="text-xs text-slate-500">Due {q.deadline} · {submittedCount}/{enrolledCount} submitted</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Submissions" action={<Link to="/trainer/performance" className="text-sm text-navy font-medium">View all</Link>} />
          <div className="divide-y divide-rule">
            {myAttempts.length === 0 && <EmptyState text="No submissions yet." />}
            {[...myAttempts].reverse().slice(0, 5).map((a) => {
              const p = pct(a.score, a.total)
              return (
                <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{userById(a.traineeId)?.name}</p>
                    <p className="text-xs text-slate-500">{courses.find((c) => c.id === a.courseId)?.questionnaires.find((q) => q.id === a.questionnaireId)?.title} · {a.submittedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!!a.tabSwitches && (
                      <span title={`${a.tabSwitches} tab switches`} className="text-amber-600"><AlertTriangle size={16} /></span>
                    )}
                    <Badge tone={p >= PASS_PCT ? 'success' : 'danger'}>{p}%</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Latest Feedback" />
          <div className="p-5 space-y-4">
            {myFeedback.length === 0 && <EmptyState text="No feedback yet." />}
            {[...myFeedback].reverse().slice(0, 4).map((f) => (
              <div key={f.id}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} className={f.rating >= n ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{courses.find((c) => c.id === f.courseId)?.title}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{f.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

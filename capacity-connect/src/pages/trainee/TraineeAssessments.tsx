import { Link } from 'react-router-dom'
import { Card, CardHeader, Badge, Medallion, StatTile, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { SUBJECTS } from '../../data/mockData'
import { subjectIcon } from '../../lib/subjects'
import { pct, PASS_PCT } from '../../lib/metrics'
import { ClipboardList, CheckCircle2, AlertCircle, Percent } from 'lucide-react'

export function TraineeAssessments() {
  const { currentUser, courses, enrollments, attempts } = useAppData()
  const me = currentUser!
  const today = new Date().toISOString().slice(0, 10)
  const enrolledIds = new Set(enrollments.filter((e) => e.traineeId === me.id).map((e) => e.courseId))

  const rows = courses.flatMap((c) =>
    c.questionnaires.map((q) => {
      const attempt = attempts.find((a) => a.questionnaireId === q.id && a.traineeId === me.id)
      const enrolled = enrolledIds.has(c.id)
      const status = attempt
        ? 'submitted'
        : !enrolled
          ? 'locked'
          : q.deadline < today
            ? 'missed'
            : 'open'
      return { q, c, attempt, status } as const
    }),
  )
  const mine = rows.filter((r) => r.status !== 'locked')
  const submitted = mine.filter((r) => r.attempt)
  const avg = submitted.length ? Math.round(submitted.reduce((s, r) => s + pct(r.attempt!.score, r.attempt!.total), 0) / submitted.length) : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={ClipboardList} label="Assigned to me" value={mine.length} />
        <StatTile icon={AlertCircle} label="Open, not attempted" value={mine.filter((r) => r.status === 'open').length} accent="saffron" />
        <StatTile icon={CheckCircle2} label="Submitted" value={submitted.length} accent="green" />
        <StatTile icon={Percent} label="Average score" value={avg === null ? '—' : `${avg}%`} accent="green" />
      </div>

      {SUBJECTS.map((s) => {
        const items = rows.filter((r) => r.c.subject === s)
        if (items.length === 0) return null
        return (
          <Card key={s}>
            <CardHeader title={s} subtitle={`${items.length} questionnaire${items.length > 1 ? 's' : ''} · pass mark ${PASS_PCT}%`} action={<Medallion icon={subjectIcon(s)} size={32} />} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-600 bg-slate-50 border-b border-rule">
                  <tr>
                    <th className="px-5 py-2.5 font-semibold">Questionnaire</th>
                    <th className="px-5 py-2.5 font-semibold">Course</th>
                    <th className="px-5 py-2.5 font-semibold text-right">Questions</th>
                    <th className="px-5 py-2.5 font-semibold">Deadline</th>
                    <th className="px-5 py-2.5 font-semibold">Status</th>
                    <th className="px-5 py-2.5 font-semibold"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {items.map(({ q, c, attempt, status }) => {
                    const p = attempt ? pct(attempt.score, attempt.total) : 0
                    return (
                      <tr key={q.id}>
                        <td className="px-5 py-3 font-semibold text-slate-800">{q.title}</td>
                        <td className="px-5 py-3 text-slate-600">{c.title}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{q.questions.length}</td>
                        <td className="px-5 py-3 tabular-nums whitespace-nowrap">{q.deadline}</td>
                        <td className="px-5 py-3">
                          {status === 'submitted' && <Badge tone={p >= PASS_PCT ? 'success' : 'danger'}>{p >= PASS_PCT ? 'Passed' : 'Not passed'} · {p}%</Badge>}
                          {status === 'open' && <Badge tone="warning">Open</Badge>}
                          {status === 'missed' && <Badge tone="danger">Deadline passed</Badge>}
                          {status === 'locked' && <Badge>Not enrolled</Badge>}
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          {status === 'open' && <Link to={`/trainee/assessment/${c.id}/${q.id}`} className="inline-block bg-navy text-white text-xs font-semibold px-3 py-1.5 hover:bg-navy-dark">Start</Link>}
                          {status === 'locked' && <Link to={`/trainee/courses/${c.id}`} className="text-xs font-semibold text-navy underline">Enrol to attempt</Link>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      })}
      {rows.length === 0 && <Card><EmptyState text="No questionnaires have been published yet." /></Card>}
    </div>
  )
}

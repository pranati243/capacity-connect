import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { AlertTriangle, ThumbsUp, Minus, ThumbsDown, Users, UserCheck, BookOpen, UserPlus, Award, ClipboardCheck, Percent, Activity } from 'lucide-react'
import { Card, CardHeader, StatTile, Badge } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { isCertified, pct, PASS_PCT } from '../../lib/metrics'
import { SERIES, AXIS_TICK, GRID_STROKE, LEGEND_PROPS } from '../../lib/chartColors'
import type { Feedback } from '../../types'

function sentimentOf(f: Feedback) {
  if (f.rating >= 4) return 'positive'
  if (f.rating === 3) return 'neutral'
  return 'negative'
}

export function AdminDashboard() {
  const { users, courses, enrollments, attempts, feedback, courseById, userById } = useAppData()

  const pending = users.filter((u) => u.status === 'pending').length
  const approved = users.filter((u) => u.status === 'approved')
  const certified = enrollments.filter((e) => isCertified(e, courseById(e.courseId), attempts))
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + pct(a.score, a.total), 0) / attempts.length)
    : 0
  const expectedSubmissions = enrollments.reduce((s, e) => s + (courseById(e.courseId)?.questionnaires.length ?? 0), 0)
  const participation = expectedSubmissions ? Math.round((attempts.length / expectedSubmissions) * 100) : 0

  const perCourse = courses.map((c) => {
    const en = enrollments.filter((e) => e.courseId === c.id)
    const at = attempts.filter((a) => a.courseId === c.id)
    const fb = feedback.filter((f) => f.courseId === c.id)
    const avgRating = fb.length ? fb.reduce((s, f) => s + f.rating, 0) / fb.length : null
    const counts = { positive: 0, neutral: 0, negative: 0 }
    fb.forEach((f) => { counts[sentimentOf(f)] += 1 })
    const avgProgress = en.length ? Math.round(en.reduce((s, e) => s + e.progress, 0) / en.length) : 0
    return {
      course: c,
      short: c.title.split(':')[0].split(' ').slice(0, 3).join(' '),
      enrolled: en.length,
      certified: en.filter((e) => isCertified(e, c, attempts)).length,
      assessments: at.length,
      passRate: at.length ? Math.round((at.filter((a) => pct(a.score, a.total) >= PASS_PCT).length / at.length) * 100) : null,
      avgProgress,
      avgRating,
      counts,
      atRisk: (avgRating !== null && avgRating < 3.5) || (en.length > 0 && avgProgress < 25),
    }
  })

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Active users" value={approved.length} hint={`${approved.filter((u) => u.role === 'trainee').length} trainees · ${approved.filter((u) => u.role === 'trainer').length} trainers`} />
        <Link to="/admin/approvals" className="block">
          <StatTile icon={UserCheck} label="Pending approvals" value={pending} accent="saffron" hint="Review queue →" />
        </Link>
        <StatTile icon={BookOpen} label="Courses" value={courses.length} hint={`${new Set(courses.map((c) => c.subject)).size} subjects`} />
        <StatTile icon={UserPlus} label="Enrollments" value={enrollments.length} />
        <StatTile icon={Award} label="Certificates issued" value={certified.length} accent="green" />
        <StatTile icon={ClipboardCheck} label="Assessments taken" value={attempts.length} />
        <StatTile icon={Percent} label="Avg. assessment score" value={`${avgScore}%`} accent="green" />
        <StatTile icon={Activity} label="Participation rate" value={`${participation}%`} hint="Submissions ÷ assigned assessments" />
      </div>

      <Card>
        <CardHeader title="Enrollments and certifications by course" />
        <div className="h-72 p-4">
          <ResponsiveContainer>
            <BarChart data={perCourse} barGap={2} maxBarSize={40}>
              <CartesianGrid vertical={false} stroke={GRID_STROKE} />
              <XAxis dataKey="short" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f0ec' }} labelFormatter={(_, p) => p?.[0]?.payload?.course?.title ?? ''} />
              <Legend {...LEGEND_PROPS} />
              <Bar isAnimationActive={false} dataKey="enrolled" name="Enrolled" fill={SERIES.blue} radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={false} dataKey="certified" name="Certified" fill={SERIES.orange} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="Course monitoring" subtitle="Feedback sentiment rolled up per course; at-risk courses are flagged" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left border-b border-rule">
              <tr>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Trainer</th>
                <th className="px-5 py-3 font-medium text-right">Enrolled</th>
                <th className="px-5 py-3 font-medium text-right">Avg. progress</th>
                <th className="px-5 py-3 font-medium text-right">Pass rate</th>
                <th className="px-5 py-3 font-medium text-right">Certified</th>
                <th className="px-5 py-3 font-medium">Sentiment</th>
                <th className="px-5 py-3 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {perCourse.map((r) => (
                <tr key={r.course.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{r.course.title}</p>
                    <p className="text-xs text-slate-500">{r.course.subject}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{userById(r.course.trainerId)?.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.enrolled}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.avgProgress}%</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.passRate === null ? '—' : `${r.passRate}%`}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.certified}</td>
                  <td className="px-5 py-3">
                    {r.avgRating === null ? (
                      <span className="text-slate-400">No feedback</span>
                    ) : (
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{r.avgRating.toFixed(1)}★</span>
                        <span className="flex items-center gap-1" title="Positive"><ThumbsUp size={12} /> {r.counts.positive}</span>
                        <span className="flex items-center gap-1" title="Neutral"><Minus size={12} /> {r.counts.neutral}</span>
                        <span className="flex items-center gap-1" title="Negative"><ThumbsDown size={12} /> {r.counts.negative}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {r.atRisk ? (
                      <Badge tone="danger"><span className="flex items-center gap-1"><AlertTriangle size={12} /> At risk</span></Badge>
                    ) : (
                      <Badge tone="success">Healthy</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CalendarClock, Sparkles, BookOpen, Percent, ClipboardList, Award } from 'lucide-react'
import { Card, CardHeader, StatTile, ProgressBar, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { bestAttemptPct, isCertified, subjectScores, pct } from '../../lib/metrics'
import { SERIES, AXIS_TICK, GRID_STROKE, LEGEND_PROPS } from '../../lib/chartColors'

export function TraineeDashboard() {
  const { currentUser, courses, enrollments, attempts, published, courseById } = useAppData()
  const me = currentUser!
  const mine = enrollments.filter((e) => e.traineeId === me.id)
  const myAttempts = attempts.filter((a) => a.traineeId === me.id)
  const avgScore = myAttempts.length
    ? Math.round(myAttempts.reduce((s, a) => s + pct(a.score, a.total), 0) / myAttempts.length)
    : 0
  const certified = mine.filter((e) => isCertified(e, courseById(e.courseId), attempts)).length

  const pending = mine.flatMap((e) => {
    const c = courseById(e.courseId)
    if (!c) return []
    return c.questionnaires
      .filter((q) => !myAttempts.some((a) => a.questionnaireId === q.id))
      .map((q) => ({ q, course: c }))
  })

  const radar = subjectScores(me.id, courses, attempts)
  const enrolledIds = new Set(mine.map((e) => e.courseId))
  const biggestGap = [...radar].sort((a, b) => b.target - b.current - (a.target - a.current))
  const recommended = biggestGap
    .map((g) => courses.find((c) => c.subject === g.subject && !enrolledIds.has(c.id)))
    .find(Boolean)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={BookOpen} label="Enrolled Courses" value={mine.length} />
        <StatTile icon={Percent} label="Avg. Assessment Score" value={`${avgScore}%`} accent="green" />
        <StatTile icon={ClipboardList} label="Pending Assessments" value={pending.length} accent="saffron" />
        <StatTile icon={Award} label="Certificates Earned" value={certified} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="My Courses" subtitle="Continue where you left off" action={<Link to="/trainee/courses" className="text-sm text-navy font-medium">Browse all</Link>} />
          <div className="divide-y divide-rule">
            {mine.length === 0 && <EmptyState text="You haven't enrolled in any course yet." />}
            {mine.map((e) => {
              const c = courseById(e.courseId)
              if (!c) return null
              const best = bestAttemptPct(attempts, me.id, c.id)
              return (
                <Link key={e.id} to={`/trainee/courses/${c.id}`} className="block px-5 py-4 hover:bg-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.subject}</p>
                    </div>
                    {best !== null && <Badge tone={best >= 60 ? 'success' : 'danger'}>Best score {best}%</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <ProgressBar value={e.progress} tone={e.progress === 100 ? 'green' : 'navy'} />
                    <span className="text-xs text-slate-500 w-10 text-right">{e.progress}%</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Upcoming Deadlines" />
          <div className="p-4 space-y-3">
            {pending.length === 0 && <EmptyState text="No pending assessments." />}
            {pending.map(({ q, course }) => (
              <Link key={q.id} to={`/trainee/assessment/${course.id}/${q.id}`} className="flex gap-3 p-3 rounded-lg border border-rule hover:border-navy">
                <CalendarClock size={18} className="text-saffron-ink shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{q.title}</p>
                  <p className="text-xs text-slate-500">Due {q.deadline} · {q.questions.length} questions</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Competency Map" subtitle="Your best assessment score per subject vs. the 75% role target" />
          <div className="h-80 p-2">
            <ResponsiveContainer>
              <RadarChart data={radar} outerRadius="70%">
                <PolarGrid stroke={GRID_STROKE} />
                <PolarAngleAxis dataKey="short" tick={AXIS_TICK} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar isAnimationActive={false} name="Target (75%)" dataKey="target" stroke={SERIES.orange} strokeWidth={2} strokeDasharray="5 4" fill="none" />
                <Radar isAnimationActive={false} name="Your best score" dataKey="current" stroke={SERIES.blue} strokeWidth={2} fill={SERIES.blue} fillOpacity={0.25} dot={{ r: 4, fill: SERIES.blue }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend {...LEGEND_PROPS} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 bg-gradient-to-br from-[#0a3d62] to-[#0d4f7f] !border-0 text-white">
            <div className="flex items-center gap-2 text-[#ff9933] text-sm font-semibold">
              <Sparkles size={16} /> Recommended next
            </div>
            {recommended ? (
              <>
                <p className="font-semibold mt-2">{recommended.title}</p>
                <p className="text-xs text-white/70 mt-1">Closes your largest skill gap: {recommended.subject}</p>
                <Link to={`/trainee/courses/${recommended.id}`} className="inline-block mt-3 text-sm bg-white text-navy px-3 py-1.5 rounded-lg font-medium">
                  View course
                </Link>
              </>
            ) : (
              <p className="text-sm text-white/70 mt-2">You're enrolled in every available course.</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Notifications" />
            <div className="p-4 space-y-3">
              {published.slice(0, 3).map((p) => (
                <div key={p.id} className="text-sm">
                  <p className="font-medium text-slate-800">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

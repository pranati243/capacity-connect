import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { SERIES, AXIS_TICK, GRID_STROKE, LEGEND_PROPS } from '../../lib/chartColors'
import { AlertTriangle, Users, ClipboardCheck, Percent } from 'lucide-react'
import { Card, CardHeader, Badge, ProgressBar, Avatar, EmptyState, StatTile } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { bestAttemptPct, pct, PASS_PCT } from '../../lib/metrics'

export function Performance() {
  const { currentUser, courses, enrollments, attempts, userById } = useAppData()
  const me = currentUser!
  const myCourses = courses.filter((c) => c.trainerId === me.id)
  const [courseId, setCourseId] = useState('all')

  const scopeCourses = courseId === 'all' ? myCourses : myCourses.filter((c) => c.id === courseId)
  const scopeIds = new Set(scopeCourses.map((c) => c.id))
  const rows = enrollments.filter((e) => scopeIds.has(e.courseId))
  const scopeAttempts = attempts.filter((a) => scopeIds.has(a.courseId))

  const questionnaires = scopeCourses.flatMap((c) => c.questionnaires.map((q) => ({ q, c })))
  const participation = questionnaires.map(({ q, c }) => {
    const enrolled = enrollments.filter((e) => e.courseId === c.id).length
    const qa = attempts.filter((a) => a.questionnaireId === q.id)
    return {
      name: q.title.length > 22 ? q.title.slice(0, 22) + '…' : q.title,
      participation: enrolled ? Math.round((qa.length / enrolled) * 100) : 0,
      avgScore: qa.length ? Math.round(qa.reduce((s, a) => s + pct(a.score, a.total), 0) / qa.length) : 0,
    }
  })

  const passed = scopeAttempts.filter((a) => pct(a.score, a.total) >= PASS_PCT).length
  const flagged = scopeAttempts.filter((a) => (a.tabSwitches ?? 0) > 0).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm font-semibold text-slate-700">Course</span>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} aria-label="Filter by course" className="border border-slate-400 px-3 py-2 text-sm bg-white">
          <option value="all">All my courses</option>
          {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Enrollments" value={rows.length} />
        <StatTile icon={ClipboardCheck} label="Submissions" value={scopeAttempts.length} />
        <StatTile icon={Percent} label="Pass rate" value={scopeAttempts.length ? `${Math.round((passed / scopeAttempts.length) * 100)}%` : '—'} accent="green" />
        <StatTile icon={AlertTriangle} label="Integrity flags" value={flagged} accent="saffron" hint="Attempts with tab switches" />
      </div>

      <Card>
        <CardHeader title="Questionnaire participation & scores" subtitle="% of enrolled trainees who submitted, and their average score" />
        <div className="h-72 p-4">
          {participation.length === 0 ? (
            <EmptyState text="No questionnaires in this scope." />
          ) : (
            <ResponsiveContainer>
              <BarChart data={participation} barGap={2} maxBarSize={40}>
                <CartesianGrid vertical={false} stroke={GRID_STROKE} />
                <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} unit="%" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: '#f1f0ec' }} />
                <Legend {...LEGEND_PROPS} />
                <Bar isAnimationActive={false} dataKey="participation" name="Participation" fill={SERIES.blue} radius={[4, 4, 0, 0]} />
                <Bar isAnimationActive={false} dataKey="avgScore" name="Avg. score" fill={SERIES.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Trainee roster" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left border-b border-rule">
              <tr>
                <th className="px-5 py-3 font-medium">Trainee</th>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium w-48">Progress</th>
                <th className="px-5 py-3 font-medium">Assessments</th>
                <th className="px-5 py-3 font-medium">Best score</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {rows.length === 0 && (
                <tr><td colSpan={6}><EmptyState text="No trainees enrolled yet." /></td></tr>
              )}
              {rows.map((e) => {
                const t = userById(e.traineeId)
                const c = courses.find((x) => x.id === e.courseId)!
                const mine = attempts.filter((a) => a.traineeId === e.traineeId && a.courseId === c.id)
                const best = bestAttemptPct(attempts, e.traineeId, c.id)
                const switches = mine.reduce((s, a) => s + (a.tabSwitches ?? 0), 0)
                const status =
                  mine.length === 0 && e.progress === 0
                    ? { label: 'Not started', tone: 'neutral' as const }
                    : best !== null && best < PASS_PCT
                      ? { label: 'Needs support', tone: 'danger' as const }
                      : e.progress === 100
                        ? { label: 'Completed', tone: 'success' as const }
                        : { label: 'Active', tone: 'info' as const }
                return (
                  <tr key={e.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {t && <Avatar name={t.name} color={t.avatarColor} size={28} />}
                        <span className="font-medium text-slate-800">{t?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{c.title}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={e.progress} />
                        <span className="text-xs text-slate-500 w-9">{e.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{mine.length}/{c.questionnaires.length}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5">
                        {best === null ? '—' : `${best}%`}
                        {switches > 0 && (
                          <span title={`${switches} tab switch(es) during assessment`} className="text-amber-600"><AlertTriangle size={14} /></span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3"><Badge tone={status.tone}>{status.label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

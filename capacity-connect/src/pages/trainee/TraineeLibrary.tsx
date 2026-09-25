import { useState } from 'react'
import { ThumbsUp, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, Button, Badge, EmptyState, Medallion } from '../../components/ui'
import { RefinePanel, RefineGroup } from '../../components/gov/RefinePanel'
import { ResourceViewer } from '../../components/ResourceViewer'
import { RESOURCE_ICON, RESOURCE_LABEL } from '../../lib/resources'
import { useAppData } from '../../context/AppDataContext'
import { SUBJECTS } from '../../data/mockData'
import { subjectIcon } from '../../lib/subjects'
import type { Course, Resource } from '../../types'

const TYPES: Resource['type'][] = ['lecture', 'presentation', 'material']

export function TraineeLibrary() {
  const { currentUser, courses, enrollments, contentFeedback, userById } = useAppData()
  const me = currentUser!
  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<Resource['type'][]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [scope, setScope] = useState<('all' | 'mine')[]>(['all'])
  const [open, setOpen] = useState<{ r: Resource; c: Course } | null>(null)

  const enrolledIds = new Set(enrollments.filter((e) => e.traineeId === me.id).map((e) => e.courseId))
  const doneIds = new Set(enrollments.filter((e) => e.traineeId === me.id).flatMap((e) => e.completedResources ?? []))

  const all = courses.flatMap((c) => c.resources.map((r) => ({ r, c })))
  const q = query.trim().toLowerCase()
  const visible = all.filter(({ r, c }) => {
    if (types.length && !types.includes(r.type)) return false
    if (subjects.length && !subjects.includes(c.subject)) return false
    if (scope[0] === 'mine' && !enrolledIds.has(c.id)) return false
    return !q || r.title.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
  })
  const bySubject = SUBJECTS.map((s) => ({ s, items: visible.filter(({ c }) => c.subject === s) })).filter((g) => g.items.length)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <RefinePanel query={query} onQuery={setQuery} placeholder="Search material" onReset={() => { setQuery(''); setTypes([]); setSubjects([]); setScope(['all']) }}>
        <RefineGroup
          title="Show"
          type="radio"
          options={[{ value: 'all', label: 'Entire library', count: all.length }, { value: 'mine', label: 'My enrolled courses' }]}
          selected={scope}
          onChange={setScope}
        />
        <RefineGroup
          title="Material type"
          options={TYPES.map((t) => ({ value: t, label: RESOURCE_LABEL[t], count: all.filter(({ r }) => r.type === t).length }))}
          selected={types}
          onChange={setTypes}
        />
        <RefineGroup
          title="Subject"
          options={SUBJECTS.map((s) => ({ value: s, label: s, count: all.filter(({ c }) => c.subject === s).length }))}
          selected={subjects}
          onChange={setSubjects}
        />
      </RefinePanel>

      <div className="lg:col-span-3 space-y-5">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{visible.length}</span> of {all.length} items. Material from every course is open to all trainees; enrol in a course to track progress towards its certificate.
        </p>
        {bySubject.length === 0 && <Card><EmptyState text="No material matches your filters." /></Card>}
        {bySubject.map(({ s, items }) => (
          <Card key={s}>
            <CardHeader title={s} subtitle={`${items.length} item${items.length > 1 ? 's' : ''}`} action={<Medallion icon={subjectIcon(s)} size={32} />} />
            <ul className="divide-y divide-rule">
              {items.map(({ r, c }) => {
                const Icon = RESOURCE_ICON[r.type]
                const fb = contentFeedback.filter((f) => f.resourceId === r.id)
                const helpfulPct = fb.length ? Math.round((fb.filter((f) => f.helpful).length / fb.length) * 100) : null
                return (
                  <li key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-navy-50 border border-rule flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-navy" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 leading-snug">
                          {r.title}
                          {doneIds.has(r.id) && <CheckCircle2 size={15} className="inline ml-1.5 text-indiagreen -mt-0.5" aria-label="Completed" />}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {RESOURCE_LABEL[r.type]} · {c.title} · {userById(c.trainerId)?.name} · {r.uploadedAt} · {r.sizeLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {helpfulPct !== null && (
                        <span className="flex items-center gap-1 text-xs text-slate-600" title={`${fb.length} rating(s)`}>
                          <ThumbsUp size={13} /> {helpfulPct}%
                        </span>
                      )}
                      {enrolledIds.has(c.id) ? <Badge tone="success">Enrolled</Badge> : <Badge>Open access</Badge>}
                      <Button variant="secondary" onClick={() => setOpen({ r, c })}>Open</Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        ))}
      </div>

      {open && <ResourceViewer resource={open.r} course={open.c} onClose={() => setOpen(null)} />}
    </div>
  )
}

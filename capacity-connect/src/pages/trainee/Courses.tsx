import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Star, CheckCircle2, FileStack, ClipboardList } from 'lucide-react'
import { Button, Badge, EmptyState, Card } from '../../components/ui'
import { RefinePanel, RefineGroup } from '../../components/gov/RefinePanel'
import { SubjectCover } from '../../components/gov/SubjectCover'
import { useAppData } from '../../context/AppDataContext'
import { SUBJECTS } from '../../data/mockData'
import type { Course } from '../../types'

const LEVELS: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced']

export function Courses() {
  const { currentUser, courses, enrollments, feedback, userById, enroll } = useAppData()
  const me = currentUser!
  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [levels, setLevels] = useState<Course['level'][]>([])
  const [scope, setScope] = useState<('all' | 'mine')[]>(['all'])

  const enrolledIds = new Set(enrollments.filter((e) => e.traineeId === me.id).map((e) => e.courseId))
  const q = query.trim().toLowerCase()
  const visible = courses.filter((c) => {
    if (scope[0] === 'mine' && !enrolledIds.has(c.id)) return false
    if (subjects.length && !subjects.includes(c.subject)) return false
    if (levels.length && !levels.includes(c.level)) return false
    return !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <RefinePanel query={query} onQuery={setQuery} placeholder="Search courses" onReset={() => { setQuery(''); setSubjects([]); setLevels([]); setScope(['all']) }}>
        <RefineGroup
          title="Show"
          type="radio"
          options={[{ value: 'all', label: 'All courses', count: courses.length }, { value: 'mine', label: 'My enrolments', count: enrolledIds.size }]}
          selected={scope}
          onChange={setScope}
        />
        <RefineGroup
          title="Subject"
          options={SUBJECTS.map((s) => ({ value: s, label: s, count: courses.filter((c) => c.subject === s).length }))}
          selected={subjects}
          onChange={setSubjects}
        />
        <RefineGroup title="Level" options={LEVELS.map((l) => ({ value: l, label: l }))} selected={levels} onChange={setLevels} />
      </RefinePanel>

      <div className="lg:col-span-3">
        <p className="text-sm text-slate-600 mb-4">
          Showing <span className="font-semibold text-slate-900">{visible.length}</span> of {courses.length} courses
        </p>
        {visible.length === 0 && <Card><EmptyState text="No courses match your filters." /></Card>}
        <div className="space-y-4">
          {visible.map((c) => {
            const trainer = userById(c.trainerId)
            const ratings = feedback.filter((f) => f.courseId === c.id)
            const avg = ratings.length ? (ratings.reduce((s, f) => s + f.rating, 0) / ratings.length).toFixed(1) : null
            const enrolled = enrolledIds.has(c.id)
            return (
              <article key={c.id} className="bg-white border border-rule border-l-4 border-l-navy flex flex-col md:flex-row">
                <SubjectCover subject={c.subject} vertical medallionSize={48} className="h-28 md:h-auto md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-rule" />
                <div className="flex-1 p-5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{c.level}</Badge>
                    {enrolled && <Badge tone="success">Enrolled</Badge>}
                  </div>
                  <Link to={`/trainee/courses/${c.id}`} className="block font-serif text-lg font-semibold text-navy mt-2 hover:underline">{c.title}</Link>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{c.description}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600 mt-3">
                    <span>Trainer: <span className="font-semibold text-slate-800">{trainer?.name}</span></span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {c.durationWeeks} weeks</span>
                    <span className="flex items-center gap-1"><FileStack size={13} /> {c.resources.length} resources</span>
                    <span className="flex items-center gap-1"><ClipboardList size={13} /> {c.questionnaires.length} assessments</span>
                    {avg && <span className="flex items-center gap-1"><Star size={13} className="text-amber-500 fill-amber-500" /> {avg} ({ratings.length})</span>}
                  </div>
                </div>
                <div className="flex md:flex-col items-center justify-end md:justify-center gap-2 px-5 py-4 border-t md:border-t-0 md:border-l border-rule md:w-44 shrink-0">
                  {enrolled ? (
                    <Link to={`/trainee/courses/${c.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-indiagreen">
                      <CheckCircle2 size={16} /> Continue
                    </Link>
                  ) : (
                    <Button onClick={() => enroll(c.id, me.id)} className="w-full">Enrol</Button>
                  )}
                  <Link to={`/trainee/courses/${c.id}`} className="text-xs font-semibold text-navy underline">View details</Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

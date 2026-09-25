import { useState } from 'react'
import { CheckCircle2, Trophy, Sparkles } from 'lucide-react'
import { Card, CardHeader, Button, TextInput, TextArea, Select, Badge, Avatar, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { SUBJECTS } from '../../data/mockData'
import { rankTrainers } from '../../lib/matching'
import { isCertified } from '../../lib/metrics'
import type { Course } from '../../types'

export function AdminCourses() {
  const { users, courses, enrollments, attempts, competencyMap, trainerRatingFor, createCourse, assignTrainer, publish, userById, courseById } = useAppData()
  const trainers = users.filter((u) => u.role === 'trainer' && u.status === 'approved')

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [level, setLevel] = useState<Course['level']>('Beginner')
  const [weeks, setWeeks] = useState('4')
  const [description, setDescription] = useState('')
  const [trainerId, setTrainerId] = useState('')
  const [announce, setAnnounce] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const ranked = rankTrainers(subject, trainers, competencyMap, courses, attempts, trainerRatingFor)
  const unmapped = trainers.filter((t) => !ranked.some((r) => r.trainer.id === t.id))
  const chosen = trainerId || ranked[0]?.trainer.id || ''

  const submit = () => {
    setError('')
    const w = Number(weeks)
    if (!title.trim() || !description.trim()) return setError('Title and description are required.')
    if (!Number.isInteger(w) || w < 1 || w > 52) return setError('Duration must be between 1 and 52 weeks.')
    if (!chosen) return setError('Select a trainer.')
    const c = createCourse({ title: title.trim(), subject, level, durationWeeks: w, description: description.trim(), trainerId: chosen })
    if (announce) {
      publish({ type: 'announcement', title: `New course: ${c.title}`, body: `${c.subject} · ${c.level} · ${c.durationWeeks} weeks, taught by ${userById(chosen)?.name}. Enrolment is open.` })
    }
    setMessage(`Created "${c.title}"${announce ? ' and announced it on the homepage' : ''}.`)
    setTitle('')
    setDescription('')
    setTrainerId('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="All courses" subtitle="Reassign a trainer at any time; the dropdown lists each trainer's match score for the course subject" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600 bg-slate-50 border-b border-rule">
              <tr>
                <th className="px-5 py-2.5 font-semibold">Course</th>
                <th className="px-5 py-2.5 font-semibold">Level</th>
                <th className="px-5 py-2.5 font-semibold text-right">Enrolled</th>
                <th className="px-5 py-2.5 font-semibold text-right">Certified</th>
                <th className="px-5 py-2.5 font-semibold">Trainer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {courses.map((c) => {
                const r = rankTrainers(c.subject, trainers, competencyMap, courses, attempts, trainerRatingFor)
                const en = enrollments.filter((e) => e.courseId === c.id)
                return (
                  <tr key={c.id}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.subject} · created {c.createdAt}</p>
                    </td>
                    <td className="px-5 py-3"><Badge>{c.level}</Badge></td>
                    <td className="px-5 py-3 text-right tabular-nums">{en.length}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{en.filter((e) => isCertified(e, courseById(e.courseId), attempts)).length}</td>
                    <td className="px-5 py-3">
                      <select
                        value={c.trainerId}
                        onChange={(e) => assignTrainer(c.id, e.target.value)}
                        aria-label={`Trainer for ${c.title}`}
                        className="border border-slate-400 bg-white px-2 py-1.5 text-sm max-w-64"
                      >
                        {trainers.map((t) => {
                          const m = r.find((x) => x.trainer.id === t.id)
                          return <option key={t.id} value={t.id}>{t.name} {m ? `(match ${m.match})` : '(not mapped)'}</option>
                        })}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Create a new course" subtitle="The trainer list is ranked from the competency map for the chosen subject" />
        <form className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); submit() }}>
          <div className="space-y-4">
            {message && <p className="flex items-center gap-2 text-sm text-indiagreen bg-green-50 border border-green-200 px-3 py-2"><CheckCircle2 size={16} /> {message}</p>}
            <TextInput label="Course title" value={title} onChange={setTitle} required placeholder="e.g. Nowcasting with Doppler Radar" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <Select label="Subject" value={subject} onChange={(v) => { setSubject(v); setTrainerId('') }} options={SUBJECTS.map((s) => ({ value: s, label: s }))} />
              </div>
              <Select label="Level" value={level} onChange={(v) => setLevel(v as Course['level'])} options={['Beginner', 'Intermediate', 'Advanced'].map((l) => ({ value: l, label: l }))} />
              <TextInput label="Duration (weeks)" type="number" value={weeks} onChange={setWeeks} required />
            </div>
            <TextArea label="Description *" value={description} onChange={setDescription} rows={4} placeholder="What will trainees learn?" />
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={announce} onChange={(e) => setAnnounce(e.target.checked)} className="w-4 h-4 accent-navy" />
              Announce this course on the homepage
            </label>
            {error && <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2" role="alert">{error}</p>}
            <Button type="submit">Create course</Button>
          </div>

          <fieldset className="min-w-0">
            <legend className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Sparkles size={15} className="text-saffron-ink" /> Assign trainer</legend>
            <div className="mt-2 space-y-2">
              {ranked.length === 0 && <EmptyState text="No trainer is mapped to this subject. Map one in the Competency Map, or pick an unmapped trainer below." />}
              {ranked.map((r, i) => (
                <label key={r.trainer.id} className={`flex items-center gap-3 p-3 border-2 cursor-pointer ${chosen === r.trainer.id ? 'border-navy bg-navy-50' : 'border-rule'}`}>
                  <input type="radio" name="trainer" checked={chosen === r.trainer.id} onChange={() => setTrainerId(r.trainer.id)} className="w-4 h-4 accent-navy" />
                  <Avatar name={r.trainer.name} color={r.trainer.avatarColor} size={34} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {r.trainer.name}
                      {i === 0 && <span className="ml-2 inline-flex items-center gap-1 text-xs text-indiagreen"><Trophy size={12} /> Best match</span>}
                    </span>
                    <span className="block text-xs text-slate-500 capitalize">{r.entry.level} · competency {r.entry.score} · rating {r.rating ? r.rating.toFixed(1) : '—'}</span>
                  </span>
                  <span className="font-serif text-xl font-bold text-navy tabular-nums">{r.match}</span>
                </label>
              ))}
              {unmapped.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Not mapped to {subject}</p>
                  {unmapped.map((t) => (
                    <label key={t.id} className={`flex items-center gap-3 p-2 border cursor-pointer mb-1 ${chosen === t.id ? 'border-navy bg-navy-50' : 'border-rule'}`}>
                      <input type="radio" name="trainer" checked={chosen === t.id} onChange={() => setTrainerId(t.id)} className="w-4 h-4 accent-navy" />
                      <span className="text-sm text-slate-700">{t.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        </form>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Trash2, Sparkles, CalendarClock, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, Button, TextInput, Select, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import type { Question } from '../../types'

const DRAFT_BANK: Record<string, Omit<Question, 'id'>[]> = {
  'Weather Forecasting Models': [
    { text: 'Which variable is NOT typically a prognostic variable in NWP models?', options: ['Temperature', 'Wind', 'Population density', 'Humidity'], correctIndex: 2 },
    { text: 'Ensemble forecasting is used mainly to:', options: ['Reduce data storage', 'Estimate forecast uncertainty', 'Replace observations', 'Speed up a single run'], correctIndex: 1 },
  ],
  'Climate Data Analysis': [
    { text: 'A climate normal is typically computed over:', options: ['1 year', '10 years', '30 years', '100 years'], correctIndex: 2 },
    { text: 'Which pandas method computes a rolling mean?', options: ['df.mean()', 'df.rolling(n).mean()', 'df.sum()', 'df.groupby()'], correctIndex: 1 },
  ],
  'Meteorological Instruments': [
    { text: 'An anemometer measures:', options: ['Rainfall', 'Wind speed', 'Pressure', 'Sunshine'], correctIndex: 1 },
    { text: 'Stevenson screens protect thermometers from:', options: ['Direct radiation', 'Wind', 'Humidity', 'Pressure'], correctIndex: 0 },
  ],
  'Satellite & Radar Systems': [
    { text: 'Doppler radar can measure:', options: ['Only rainfall', 'Radial velocity of targets', 'Soil moisture', 'Ocean salinity'], correctIndex: 1 },
    { text: 'INSAT-3D is a:', options: ['Polar orbiting satellite', 'Geostationary satellite', 'Ground radar', 'Weather balloon'], correctIndex: 1 },
  ],
}

const blankQuestion = (): Question => ({
  id: `nq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
})

export function Questionnaires() {
  const { currentUser, courses, attempts, enrollments, createQuestionnaire } = useAppData()
  const me = currentUser!
  const myCourses = courses.filter((c) => c.trainerId === me.id)

  const [courseId, setCourseId] = useState(myCourses[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()])
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  const course = myCourses.find((c) => c.id === courseId)

  const updateQ = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const draftFromLibrary = () => {
    const bank = course ? DRAFT_BANK[course.subject] ?? [] : []
    if (bank.length === 0) return
    const drafted = bank.map((q) => ({ ...q, id: `nq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }))
    setQuestions((qs) => [...qs.filter((q) => q.text.trim()), ...drafted])
  }

  const publish = () => {
    setError('')
    const today = new Date().toISOString().slice(0, 10)
    if (!courseId) return setError('Select a course.')
    if (!title.trim()) return setError('Give the questionnaire a title.')
    if (!deadline || deadline < today) return setError('Pick a deadline in the future.')
    const valid = questions.filter((q) => q.text.trim() && q.options.every((o) => o.trim()))
    if (valid.length === 0) return setError('Add at least one complete question (text and all 4 options).')
    if (valid.length !== questions.length) return setError('Some questions are incomplete. Fill or remove them.')
    createQuestionnaire(courseId, { title: title.trim(), deadline, questions: valid })
    setSaved(`"${title.trim()}" published to ${course?.title}.`)
    setTitle('')
    setDeadline('')
    setQuestions([blankQuestion()])
  }

  return (
    <div className="space-y-6 max-w-5xl">

      <Card>
        <CardHeader title="Published questionnaires" />
        <div className="divide-y divide-rule">
          {myCourses.every((c) => c.questionnaires.length === 0) && <EmptyState text="None yet." />}
          {myCourses.flatMap((c) =>
            c.questionnaires.map((q) => {
              const submitted = attempts.filter((a) => a.questionnaireId === q.id).length
              const enrolled = enrollments.filter((e) => e.courseId === c.id).length
              const closed = q.deadline < new Date().toISOString().slice(0, 10)
              return (
                <div key={q.id} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{q.title}</p>
                    <p className="text-xs text-slate-500">{c.title} · {q.questions.length} questions</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><CalendarClock size={14} /> {q.deadline}</span>
                  <Badge tone={closed ? 'neutral' : 'success'}>{closed ? 'Closed' : 'Open'}</Badge>
                  <Badge tone="info">{submitted}/{enrolled} submitted</Badge>
                </div>
              )
            }),
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Create questionnaire"
          action={
            <Button variant="secondary" onClick={draftFromLibrary} disabled={!course || !DRAFT_BANK[course.subject]}>
              <span className="flex items-center gap-2"><Sparkles size={16} /> Draft from library</span>
            </Button>
          }
        />
        <div className="p-5 space-y-5">
          {saved && (
            <p className="flex items-center gap-2 text-sm text-indiagreen bg-green-50 rounded-lg px-3 py-2"><CheckCircle2 size={16} /> {saved}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Course"
              value={courseId}
              onChange={setCourseId}
              options={myCourses.map((c) => ({ value: c.id, label: c.title }))}
            />
            <TextInput label="Title" value={title} onChange={setTitle} placeholder="e.g. Module 2 Assessment" required />
            <TextInput label="Deadline" type="date" value={deadline} onChange={setDeadline} required />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles size={12} /> "Draft from library" suggests questions from this course's uploaded material. Review every question before publishing. (Prototype: uses a sample question bank.)
          </p>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={q.id} className="border border-rule rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center shrink-0">{qi + 1}</span>
                  <input
                    value={q.text}
                    onChange={(e) => updateQ(q.id, { text: e.target.value })}
                    placeholder="Question text"
                    aria-label={`Question ${qi + 1} text`}
                    className="flex-1 border border-slate-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                  <button
                    onClick={() => setQuestions((qs) => (qs.length > 1 ? qs.filter((x) => x.id !== q.id) : [blankQuestion()]))}
                    aria-label={`Remove question ${qi + 1}`}
                    className="text-slate-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 ml-10">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${q.correctIndex === oi ? 'border-indiagreen bg-green-50' : 'border-rule'}`}>
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQ(q.id, { correctIndex: oi })}
                        aria-label={`Mark option ${String.fromCharCode(65 + oi)} correct`}
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateQ(q.id, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) })}
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-10">Select the radio button next to the correct answer.</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="secondary" onClick={() => setQuestions((qs) => [...qs, blankQuestion()])}>
              <span className="flex items-center gap-2"><Plus size={16} /> Add question</span>
            </Button>
            <div className="flex items-center gap-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={publish}>Publish questionnaire</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

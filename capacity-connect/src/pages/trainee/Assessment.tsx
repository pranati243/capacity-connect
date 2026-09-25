import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Timer, CheckCircle2, XCircle, ShieldAlert, Lock } from 'lucide-react'
import { Card, Button, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { pct, PASS_PCT } from '../../lib/metrics'

const SECONDS_PER_QUESTION = 60
const MAX_TAB_SWITCHES = 3

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function Assessment() {
  const { courseId, questionnaireId } = useParams()
  const navigate = useNavigate()
  const { currentUser, courseById, attempts, enrollments, submitAttempt } = useAppData()
  const me = currentUser!
  const course = courseById(courseId ?? '')
  const questionnaire = course?.questionnaires.find((q) => q.id === questionnaireId)

  const [order] = useState(() =>
    questionnaire
      ? shuffle(questionnaire.questions).map((q) => ({ q, optionOrder: shuffle(q.options.map((_, i) => i)) }))
      : [],
  )
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(order.length * SECONDS_PER_QUESTION)
  const [tabSwitches, setTabSwitches] = useState(0)
  const submittedRef = useRef(false)

  const alreadyAttempted = attempts.some((a) => a.questionnaireId === questionnaireId && a.traineeId === me.id)

  const finish = () => {
    if (submittedRef.current || !questionnaire || !course) return
    submittedRef.current = true
    const score = order.filter(({ q }) => answers[q.id] === q.correctIndex).length
    submitAttempt({
      questionnaireId: questionnaire.id,
      courseId: course.id,
      traineeId: me.id,
      score,
      total: order.length,
      tabSwitches,
    })
    setSubmitted(true)
  }
  const finishRef = useRef(finish)
  useEffect(() => {
    finishRef.current = finish
  })

  useEffect(() => {
    if (!started || submitted) return
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [started, submitted])

  useEffect(() => {
    if (started && !submitted && secondsLeft <= 0) finishRef.current()
  }, [secondsLeft, started, submitted])

  useEffect(() => {
    if (!started || submitted) return
    const onHide = () => {
      if (document.hidden) setTabSwitches((n) => n + 1)
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [started, submitted])

  useEffect(() => {
    if (tabSwitches >= MAX_TAB_SWITCHES) finishRef.current()
  }, [tabSwitches])

  if (!course || !questionnaire) return <EmptyState text="Assessment not found." />

  const isEnrolled = enrollments.some((e) => e.courseId === course.id && e.traineeId === me.id)
  const pastDeadline = questionnaire.deadline < new Date().toISOString().slice(0, 10)
  if (!submitted && !alreadyAttempted && (!isEnrolled || pastDeadline)) {
    return (
      <Card className="p-10 text-center max-w-xl mx-auto">
        <Lock size={40} className="text-slate-400 mx-auto" />
        <p className="font-serif text-lg font-semibold text-navy mt-3">{!isEnrolled ? 'Enrolment required' : 'Submission closed'}</p>
        <p className="text-sm text-slate-600 mt-1">
          {!isEnrolled
            ? `Enrol in "${course.title}" to attempt this assessment.`
            : `The deadline for "${questionnaire.title}" was ${questionnaire.deadline}.`}
        </p>
        <Link to={`/trainee/courses/${course.id}`} className="inline-block mt-4 text-navy font-semibold text-sm underline">Go to course</Link>
      </Card>
    )
  }

  if (alreadyAttempted && !submitted) {
    return (
      <Card className="p-10 text-center max-w-xl mx-auto">
        <CheckCircle2 size={40} className="text-indiagreen mx-auto" />
        <p className="font-semibold text-slate-800 mt-3">You have already submitted this assessment.</p>
        <Link to={`/trainee/courses/${course.id}`} className="inline-block mt-4 text-navy font-medium text-sm">Back to course</Link>
      </Card>
    )
  }

  if (!started) {
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <Badge tone="info">{course.subject}</Badge>
        <h2 className="font-serif text-2xl font-bold text-navy mt-3">{questionnaire.title}</h2>
        <p className="text-slate-500 mt-1">{course.title}</p>
        <div className="grid grid-cols-3 gap-4 my-6">
          <Info label="Questions" value={order.length} />
          <Info label="Time limit" value={`${Math.ceil((order.length * SECONDS_PER_QUESTION) / 60)} min`} />
          <Info label="Pass mark" value={`${PASS_PCT}%`} />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-1">
          <p className="font-semibold flex items-center gap-2"><ShieldAlert size={16} /> Assessment integrity</p>
          <p>Questions and options are shuffled for every attempt.</p>
          <p>Switching tabs or windows is recorded. After {MAX_TAB_SWITCHES} switches the test submits automatically.</p>
          <p>Only one attempt is allowed. Deadline: {questionnaire.deadline}.</p>
        </div>
        <Button className="mt-6 w-full" onClick={() => setStarted(true)}>I understand, begin assessment</Button>
      </Card>
    )
  }

  if (submitted) {
    const score = order.filter(({ q }) => answers[q.id] === q.correctIndex).length
    const percent = pct(score, order.length)
    const passed = percent >= PASS_PCT
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          {passed ? <CheckCircle2 size={48} className="text-indiagreen mx-auto" /> : <XCircle size={48} className="text-red-500 mx-auto" />}
          <p className="text-4xl font-bold text-slate-800 mt-3">{percent}%</p>
          <p className="text-slate-500">{score} of {order.length} correct · {passed ? 'Passed' : 'Not passed'}</p>
          {tabSwitches > 0 && (
            <p className="text-sm text-amber-700 mt-2">{tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''} recorded and shared with your trainer.</p>
          )}
          <Button className="mt-5" onClick={() => navigate(`/trainee/courses/${course.id}`)}>Back to course</Button>
        </Card>
        <Card className="p-6 space-y-5">
          <h2 className="font-semibold text-slate-800">Answer review</h2>
          {order.map(({ q }, i) => {
            const chosen = answers[q.id]
            const right = chosen === q.correctIndex
            return (
              <div key={q.id} className="border-b border-rule pb-4 last:border-0">
                <p className="font-medium text-slate-800">{i + 1}. {q.text}</p>
                <p className={`text-sm mt-1 ${right ? 'text-indiagreen' : 'text-red-600'}`}>
                  Your answer: {chosen === undefined ? 'Not answered' : q.options[chosen]}
                </p>
                {!right && <p className="text-sm text-slate-600">Correct answer: {q.options[q.correctIndex]}</p>}
              </div>
            )
          })}
        </Card>
      </div>
    )
  }

  const { q, optionOrder } = order[current]
  const mins = Math.floor(secondsLeft / 60)
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {tabSwitches > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3" role="alert">
          <AlertTriangle size={16} />
          Tab switch detected ({tabSwitches}/{MAX_TAB_SWITCHES}). The test will auto-submit at {MAX_TAB_SWITCHES}.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Question {current + 1} of {order.length}</p>
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${secondsLeft < 30 ? 'text-red-600' : 'text-slate-700'}`}>
              <Timer size={16} /> {mins}:{secs}
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-800 mt-4">{q.text}</p>
          <div className="space-y-3 mt-5" role="radiogroup">
            {optionOrder.map((optIdx, displayIdx) => {
              const selected = answers[q.id] === optIdx
              return (
                <button
                  key={optIdx}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: optIdx }))}
                  className={`w-full text-left flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    selected ? 'border-navy bg-navy-50' : 'border-rule hover:border-slate-300'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${selected ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {String.fromCharCode(65 + displayIdx)}
                  </span>
                  <span className="text-slate-700">{q.options[optIdx]}</span>
                </button>
              )
            })}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</Button>
            {current < order.length - 1 ? (
              <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
            ) : (
              <Button onClick={finish}>Submit assessment</Button>
            )}
          </div>
        </Card>

        <Card className="p-4 h-fit">
          <p className="text-sm font-semibold text-slate-700">Question navigator</p>
          <p className="text-xs text-slate-500">{answeredCount}/{order.length} answered</p>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {order.map(({ q: qq }, i) => (
              <button
                key={qq.id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to question ${i + 1}`}
                className={`h-9 rounded-md text-sm font-medium ${
                  i === current
                    ? 'ring-2 ring-navy ring-offset-1'
                    : ''
                } ${answers[qq.id] !== undefined ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-4" onClick={finish}>Submit now</Button>
        </Card>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className="text-xl font-bold text-navy">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

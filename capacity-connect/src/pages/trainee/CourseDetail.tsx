import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Lock, Star, ClipboardList, CalendarClock, Clock, BarChart2, Users } from 'lucide-react'
import { Card, CardHeader, Badge, Button, ProgressBar, EmptyState, Avatar, TextArea, Medallion } from '../../components/ui'
import { ResourceViewer } from '../../components/ResourceViewer'
import { RESOURCE_ICON, RESOURCE_LABEL } from '../../lib/resources'
import { useAppData } from '../../context/AppDataContext'
import { pct, PASS_PCT } from '../../lib/metrics'
import { subjectIcon } from '../../lib/subjects'
import { subjectPhoto } from '../../lib/photos'
import type { Resource } from '../../types'

const SECTIONS = [
  ['overview', 'Overview'],
  ['resources', 'Learning Resources'],
  ['assessments', 'Assessments'],
  ['feedback', 'Feedback'],
] as const

export function CourseDetail() {
  const { courseId } = useParams()
  const { currentUser, courseById, userById, enrollments, attempts, enroll, toggleResource } = useAppData()
  const me = currentUser!
  const course = courseById(courseId ?? '')
  const [open, setOpen] = useState<Resource | null>(null)

  if (!course) return <EmptyState text="Course not found." />

  const trainer = userById(course.trainerId)
  const enrollment = enrollments.find((e) => e.courseId === course.id && e.traineeId === me.id)
  const done = new Set(enrollment?.completedResources ?? [])
  const enrolledCount = enrollments.filter((e) => e.courseId === course.id).length
  const today = new Date().toISOString().slice(0, 10)
  const photo = subjectPhoto(course.subject)

  return (
    <div className="space-y-5">
      <Link to="/trainee/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline">
        <ArrowLeft size={16} /> Back to course catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-4 lg:sticky lg:top-4 h-fit">
          <nav aria-label="On this page" className="bg-white border border-rule">
            <p className="px-4 py-2.5 bg-navy text-white text-sm font-semibold">On this page</p>
            <ul className="text-sm">
              {SECTIONS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="block px-4 py-2 border-b border-rule last:border-b-0 text-slate-700 hover:bg-navy-50 hover:text-navy">{label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="bg-white border border-rule p-4">
            {enrollment ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your progress</p>
                <p className="font-serif text-3xl font-bold text-navy mt-1 tabular-nums">{enrollment.progress}%</p>
                <ProgressBar value={enrollment.progress} tone={enrollment.progress === 100 ? 'green' : 'navy'} />
                <p className="text-xs text-slate-500 mt-2">Enrolled on {enrollment.enrolledAt}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-3">Enrol to track progress, attempt assessments and earn a certificate.</p>
                <Button className="w-full" onClick={() => enroll(course.id, me.id)}>Enrol in this course</Button>
              </>
            )}
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <Card className="scroll-mt-4">
            <div id="overview" className="scroll-mt-4" />
            {photo && (
              <figure className="relative">
                <img src={photo.src} alt={photo.alt} className="w-full h-44 md:h-56 object-cover" />
                <figcaption className="absolute bottom-1.5 right-2 text-[0.65rem] text-white bg-black/45 px-1.5 py-0.5">
                  Photo: {photo.author}, {photo.license}
                </figcaption>
              </figure>
            )}
            <div className="p-6 flex flex-col md:flex-row gap-5">
              <Medallion icon={subjectIcon(course.subject)} size={64} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-saffron-ink">{course.subject}</p>
                <h2 className="font-serif text-2xl font-bold text-navy mt-1">{course.title}</h2>
                <p className="text-slate-700 mt-2 leading-relaxed">{course.description}</p>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm">
                  {[
                    [BarChart2, 'Level', course.level],
                    [Clock, 'Duration', `${course.durationWeeks} weeks`],
                    [Users, 'Enrolled', String(enrolledCount)],
                    [ClipboardList, 'Assessments', String(course.questionnaires.length)],
                  ].map(([Icon, k, v]) => {
                    const I = Icon as typeof Clock
                    return (
                      <div key={k as string} className="border border-rule bg-paper px-3 py-2">
                        <dt className="text-xs text-slate-500 flex items-center gap-1"><I size={12} /> {k as string}</dt>
                        <dd className="font-semibold text-slate-800">{v as string}</dd>
                      </div>
                    )
                  })}
                </dl>
                {trainer && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-rule">
                    <Avatar name={trainer.name} color={trainer.avatarColor} size={40} />
                    <div>
                      <p className="text-xs text-slate-500">Course trainer</p>
                      <p className="text-sm font-semibold text-slate-800">{trainer.name}</p>
                      <p className="text-xs text-slate-500">{trainer.profile.qualifications[0]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div id="resources" className="scroll-mt-4" />
            <CardHeader title="Learning Resources" subtitle="Open any item to view it; mark it complete to update your progress" />
            <ul className="divide-y divide-rule">
              {course.resources.length === 0 && <li><EmptyState text="No resources uploaded yet." /></li>}
              {course.resources.map((r, idx) => {
                const Icon = RESOURCE_ICON[r.type]
                const isDone = done.has(r.id)
                return (
                  <li key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-7 text-center font-serif font-bold text-slate-400 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="w-10 h-10 bg-navy-50 border border-rule flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-navy" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{r.title}</p>
                        <p className="text-xs text-slate-500">{RESOURCE_LABEL[r.type]} · {r.sizeLabel} · Uploaded {r.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="secondary" onClick={() => setOpen(r)}>Open</Button>
                      {enrollment && (
                        <Button variant="ghost" onClick={() => toggleResource(enrollment.id, r.id, course.resources.length)}>
                          <span className={`flex items-center gap-1.5 ${isDone ? 'text-indiagreen' : ''}`}>
                            {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            {isDone ? 'Completed' : 'Mark complete'}
                          </span>
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card>
            <div id="assessments" className="scroll-mt-4" />
            <CardHeader title="Subject-wise MCQ Assessments" subtitle={`One attempt each · pass mark ${PASS_PCT}%`} />
            {!enrollment ? (
              <p className="flex items-center gap-2 p-5 text-sm text-slate-600"><Lock size={16} /> Enrol in this course to attempt its assessments.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {course.questionnaires.length === 0 && <li><EmptyState text="No assessments published for this course yet." /></li>}
                {course.questionnaires.map((q) => {
                  const last = attempts.filter((a) => a.questionnaireId === q.id && a.traineeId === me.id).at(-1)
                  const overdue = q.deadline < today
                  return (
                    <li key={q.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{q.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><CalendarClock size={12} /> Due {q.deadline} · {q.questions.length} questions</p>
                      </div>
                      {last ? (
                        <Badge tone={pct(last.score, last.total) >= PASS_PCT ? 'success' : 'danger'}>
                          Scored {last.score}/{last.total} ({pct(last.score, last.total)}%)
                        </Badge>
                      ) : overdue ? (
                        <Badge tone="danger">Deadline passed</Badge>
                      ) : (
                        <Link to={`/trainee/assessment/${course.id}/${q.id}`} className="bg-navy text-white text-sm font-semibold px-4 py-2 hover:bg-navy-dark text-center">Start assessment</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          <div id="feedback" className="scroll-mt-4">
            <FeedbackPanel courseId={course.id} canSubmit={!!enrollment} />
          </div>
        </div>
      </div>

      {open && <ResourceViewer resource={open} course={course} onClose={() => setOpen(null)} />}
    </div>
  )
}

function FeedbackPanel({ courseId, canSubmit }: { courseId: string; canSubmit: boolean }) {
  const { currentUser, feedback, submitFeedback, userById } = useAppData()
  const me = currentUser!
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [contentRating, setContentRating] = useState('')
  const list = feedback.filter((f) => f.courseId === courseId)
  const alreadySubmitted = list.some((f) => f.traineeId === me.id)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Course Feedback" subtitle="Rate the course and its training content" />
        <div className="p-5">
          {!canSubmit ? (
            <p className="text-sm text-slate-600">Enrol to leave feedback on this course.</p>
          ) : alreadySubmitted ? (
            <p className="text-sm text-indiagreen flex items-center gap-2"><CheckCircle2 size={16} /> Thank you, your feedback has been recorded.</p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (!rating) return
                const prefix = contentRating ? `[Content: ${contentRating}] ` : ''
                submitFeedback({ courseId, traineeId: me.id, rating, comment: prefix + comment.trim() })
              }}
            >
              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold text-slate-800 mb-1">Overall rating <span className="text-red-700">*</span></legend>
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onMouseEnter={() => setHover(n)} onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating === n}>
                      <Star size={28} className={(hover || rating) >= n ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold text-slate-800 mb-1">The training content was</legend>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {['Too basic', 'Just right', 'Too advanced'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name={`content-${courseId}`} checked={contentRating === opt} onChange={() => setContentRating(opt)} className="w-4 h-4 accent-[#0a3d62]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
              <TextArea label="Comments" value={comment} onChange={setComment} placeholder="What worked well? What could be better?" />
              <Button type="submit" disabled={!rating}>Submit feedback</Button>
              <p className="text-xs text-slate-500">To rate an individual lecture or document, open it from Learning Resources.</p>
            </form>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="What other trainees said" subtitle={`${list.length} review${list.length === 1 ? '' : 's'}`} />
        <div className="p-5 space-y-4">
          {list.length === 0 && <EmptyState text="No feedback yet." />}
          {list.map((f) => {
            const who = userById(f.traineeId)
            return (
              <div key={f.id} className="border-b border-rule pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{who?.name ?? 'Trainee'}</p>
                  <div className="flex" aria-label={`${f.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={14} className={f.rating >= n ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 mt-1">{f.comment}</p>
                <p className="text-xs text-slate-400 mt-1">{f.submittedAt}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

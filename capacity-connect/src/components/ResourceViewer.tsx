import { useEffect, useRef, useState } from 'react'
import { X, Play, Pause, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, CheckCircle2, Circle } from 'lucide-react'
import { RESOURCE_ICON, RESOURCE_LABEL } from '../lib/resources'
import { Button, Badge } from './ui'
import { useAppData } from '../context/AppDataContext'
import type { Course, Resource } from '../types'

const LECTURE_SECONDS = 45 * 60
const PREVIEW_MS = 15000

function LecturePlayer({ resource, course, onFinished }: { resource: Resource; course: Course; onFinished: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)

  const finishedRef = useRef(onFinished)
  const posRef = useRef(0)
  useEffect(() => {
    finishedRef.current = onFinished
  })

  const seek = (p: number) => {
    posRef.current = p
    setPos(p)
  }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      const next = Math.min(1, posRef.current + 250 / PREVIEW_MS)
      seek(next)
      if (next >= 1) {
        setPlaying(false)
        finishedRef.current()
      }
    }, 250)
    return () => clearInterval(id)
  }, [playing])

  const start = () => {
    if (posRef.current >= 1) seek(0)
    setPlaying(true)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  return (
    <div className="bg-[#0b1520] text-white">
      <div className="relative aspect-video flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-navy to-[#0b1520]">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-saffron">{course.subject}</p>
        <p className="font-serif text-lg md:text-2xl font-bold mt-2 max-w-lg">{resource.title}</p>
        <p className="text-xs text-white/60 mt-1">{course.title}</p>
        {!playing && (
          <button onClick={start} className="mt-5 w-16 h-16 rounded-full bg-saffron text-[#2b1600] flex items-center justify-center hover:scale-105 transition-transform" aria-label="Play lecture">
            <Play size={28} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 px-4 py-2 text-xs">
        <button onClick={() => (playing ? setPlaying(false) : start())} aria-label={playing ? 'Pause' : 'Play'} className="p-1 hover:bg-white/10">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex-1 h-1.5 bg-white/20 cursor-pointer" onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
        }}>
          <div className="h-full bg-saffron" style={{ width: `${pos * 100}%` }} />
        </div>
        <span className="tabular-nums text-white/80">{fmt(pos * LECTURE_SECONDS)} / {fmt(LECTURE_SECONDS)}</span>
      </div>
      <p className="px-4 pb-2 text-[0.65rem] text-white/40">Prototype preview: playback is time-compressed.</p>
    </div>
  )
}

function SlideViewer({ resource, course }: { resource: Resource; course: Course }) {
  const slides = [
    { h: resource.title, lines: [course.title, course.subject] },
    { h: 'Learning objectives', lines: course.description.split(/[,.]/).map((s) => s.trim()).filter(Boolean).slice(0, 4) },
    { h: 'Key concepts', lines: [`Core principles of ${course.subject.toLowerCase()}`, 'Operational procedures and standards', 'Common errors and quality checks', 'Case study from field operations'] },
    { h: 'Summary', lines: ['Review the key concepts above', 'Attempt the module assessment before its deadline', 'Share feedback on this material'] },
  ]
  const [i, setI] = useState(0)
  const s = slides[i]
  return (
    <div className="bg-slate-200 p-3 md:p-5">
      <div className="bg-white aspect-video border border-rule shadow-sm flex flex-col">
        <div className="h-2 bg-navy" />
        <div className="flex-1 p-5 md:p-8 overflow-hidden">
          <p className={`font-serif font-bold text-navy ${i === 0 ? 'text-xl md:text-3xl mt-6 md:mt-10' : 'text-lg md:text-2xl'}`}>{s.h}</p>
          <div className="w-14 h-1 bg-saffron mt-2" />
          <ul className={`mt-4 space-y-1.5 text-sm md:text-base text-slate-700 ${i === 0 ? '' : 'list-disc pl-5'}`}>
            {s.lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <div className="px-4 py-1.5 text-[0.65rem] text-slate-500 border-t border-rule flex justify-between">
          <span>CAPACITY CONNECT · {course.subject}</span>
          <span>{i + 1}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-3">
        <Button variant="secondary" onClick={() => setI(i - 1)} disabled={i === 0}><ChevronLeft size={16} /></Button>
        <span className="text-sm text-slate-700 tabular-nums">Slide {i + 1} of {slides.length}</span>
        <Button variant="secondary" onClick={() => setI(i + 1)} disabled={i === slides.length - 1}><ChevronRight size={16} /></Button>
      </div>
    </div>
  )
}

function DocumentPreview({ resource, course }: { resource: Resource; course: Course }) {
  return (
    <div className="bg-slate-200 p-3 md:p-6 max-h-[60vh] overflow-y-auto">
      <div className="bg-white max-w-xl mx-auto p-6 md:p-10 shadow-sm border border-rule">
        <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">{course.subject}</p>
        <p className="font-serif text-xl font-bold text-navy mt-1">{resource.title}</p>
        <div className="w-14 h-1 bg-saffron mt-2 mb-5" />
        {[1, 2, 3].map((sec) => (
          <div key={sec} className="mb-5">
            <p className="font-semibold text-slate-800 text-sm mb-2">{sec}. {['Introduction', 'Procedure', 'Checklist'][sec - 1]}</p>
            {[92, 100, 96, 70].map((w, k) => (
              <div key={k} className="h-2 bg-slate-200 mb-1.5" style={{ width: `${w - sec * 3}%` }} />
            ))}
          </div>
        ))}
        <p className="text-xs text-slate-400 italic">Page 1 of 4 · {resource.sizeLabel}</p>
      </div>
    </div>
  )
}

export function ResourceViewer({ resource, course, onClose }: { resource: Resource; course: Course; onClose: () => void }) {
  const { currentUser, enrollments, toggleResource, contentFeedback, submitContentFeedback, userById } = useAppData()
  const me = currentUser!
  const enrollment = enrollments.find((e) => e.courseId === course.id && e.traineeId === me.id)
  const done = enrollment?.completedResources?.includes(resource.id) ?? false
  const mine = contentFeedback.find((f) => f.resourceId === resource.id && f.traineeId === me.id)
  const all = contentFeedback.filter((f) => f.resourceId === resource.id)
  const helpful = all.filter((f) => f.helpful).length
  const [comment, setComment] = useState(mine?.comment ?? '')
  const [choice, setChoice] = useState<boolean | null>(mine?.helpful ?? null)
  const [saved, setSaved] = useState(false)
  const Icon = RESOURCE_ICON[resource.type]
  const trainer = userById(course.trainerId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const markDoneIfNeeded = () => {
    if (enrollment && !done) toggleResource(enrollment.id, resource.id, course.resources.length)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start md:items-center justify-center p-2 md:p-6 overflow-y-auto" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={resource.title} className="bg-white w-full max-w-5xl border-t-4 border-saffron" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 px-5 py-3 bg-navy text-white">
          <Icon size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-serif font-semibold leading-snug">{resource.title}</p>
            <p className="text-xs text-white/70">{RESOURCE_LABEL[resource.type]} · {course.title} · {trainer?.name} · Uploaded {resource.uploadedAt}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/15"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {resource.type === 'lecture' && <LecturePlayer resource={resource} course={course} onFinished={markDoneIfNeeded} />}
            {resource.type === 'presentation' && <SlideViewer resource={resource} course={course} />}
            {resource.type === 'material' && <DocumentPreview resource={resource} course={course} />}
          </div>
          <div className="p-5 space-y-5 border-t lg:border-t-0 lg:border-l border-rule">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Your progress</p>
              {enrollment ? (
                <Button variant={done ? 'secondary' : 'primary'} className="w-full" onClick={() => toggleResource(enrollment.id, resource.id, course.resources.length)}>
                  <span className="flex items-center justify-center gap-2">
                    {done ? <CheckCircle2 size={16} className="text-indiagreen" /> : <Circle size={16} />}
                    {done ? 'Completed' : 'Mark as complete'}
                  </span>
                </Button>
              ) : (
                <p className="text-sm text-slate-600">Enrol in <span className="font-semibold">{course.title}</span> to track progress and earn its certificate.</p>
              )}
            </div>
            <div className="border-t border-rule pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Rate this material</p>
              <p className="text-xs text-slate-500 mt-0.5">{all.length ? `${helpful} of ${all.length} trainees found this helpful` : 'No ratings yet'}</p>
              <div className="flex gap-2 mt-3" role="radiogroup" aria-label="Was this material helpful?">
                <button role="radio" aria-checked={choice === true} onClick={() => { setChoice(true); setSaved(false) }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 border text-sm font-semibold ${choice === true ? 'border-indiagreen bg-green-50 text-indiagreen' : 'border-rule text-slate-600'}`}>
                  <ThumbsUp size={15} /> Helpful
                </button>
                <button role="radio" aria-checked={choice === false} onClick={() => { setChoice(false); setSaved(false) }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 border text-sm font-semibold ${choice === false ? 'border-red-700 bg-red-50 text-red-800' : 'border-rule text-slate-600'}`}>
                  <ThumbsDown size={15} /> Not helpful
                </button>
              </div>
              <textarea
                value={comment}
                onChange={(e) => { setComment(e.target.value); setSaved(false) }}
                rows={3}
                placeholder="Optional: what should the trainer improve?"
                aria-label="Comment on this material"
                className="mt-2 w-full border border-slate-400 px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
              <Button
                className="mt-2 w-full"
                variant="secondary"
                disabled={choice === null}
                onClick={() => {
                  if (choice === null) return
                  submitContentFeedback({ resourceId: resource.id, courseId: course.id, traineeId: me.id, helpful: choice, comment: comment.trim() })
                  setSaved(true)
                }}
              >
                {mine ? 'Update feedback' : 'Submit feedback'}
              </Button>
              {saved && <p className="text-xs text-indiagreen mt-1.5 flex items-center gap-1"><CheckCircle2 size={12} /> Feedback shared with the trainer.</p>}
            </div>
            <div className="border-t border-rule pt-4 flex flex-wrap gap-2">
              <Badge>{resource.sizeLabel}</Badge>
              <Badge tone="info">{course.subject}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

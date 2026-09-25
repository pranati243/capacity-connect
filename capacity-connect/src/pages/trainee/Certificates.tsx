import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Award, Printer, X, Lock } from 'lucide-react'
import { Card, CardHeader, Button, Badge, EmptyState, ProgressBar } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { bestAttemptPct, certificateId, isCertified, PASS_PCT } from '../../lib/metrics'
import type { Enrollment } from '../../types'

export function Certificates() {
  const { currentUser, enrollments, attempts, courseById } = useAppData()
  const me = currentUser!
  const mine = enrollments.filter((e) => e.traineeId === me.id)
  const earned = mine.filter((e) => isCertified(e, courseById(e.courseId), attempts))
  const inProgress = mine.filter((e) => !earned.includes(e))
  const [open, setOpen] = useState<Enrollment | null>(null)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
                <p className="text-sm text-slate-700 bg-white border border-rule border-l-4 border-l-saffron px-4 py-3">
          Awarded when you complete every resource and score at least {PASS_PCT}% in the course assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {earned.length === 0 && (
          <Card className="md:col-span-2"><EmptyState text="No certificates yet. Complete a course to earn one." /></Card>
        )}
        {earned.map((e) => {
          const c = courseById(e.courseId)!
          return (
            <Card key={e.id} className="p-5 flex gap-4 items-start border-l-4 !border-l-indiagreen">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Award className="text-indiagreen" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">Certificate ID {certificateId(e.id)}</p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => setOpen(e)}>View certificate</Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {inProgress.length > 0 && (
        <Card>
          <CardHeader title="In progress" subtitle="What's left before each certificate unlocks" />
          <div className="divide-y divide-rule">
            {inProgress.map((e) => {
              const c = courseById(e.courseId)
              if (!c) return null
              const best = bestAttemptPct(attempts, me.id, c.id)
              const needsTest = c.questionnaires.length > 0 && (best === null || best < PASS_PCT)
              return (
                <div key={e.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Lock size={18} className="text-slate-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/trainee/courses/${c.id}`} className="font-medium text-slate-800 hover:text-navy">{c.title}</Link>
                    <div className="flex items-center gap-3 mt-1.5">
                      <ProgressBar value={e.progress} />
                      <span className="text-xs text-slate-500 w-10">{e.progress}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {e.progress < 100 && <Badge tone="warning">Resources pending</Badge>}
                    {needsTest && <Badge tone="warning">{best === null ? 'Assessment pending' : `Best ${best}%, need ${PASS_PCT}%`}</Badge>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {open && <CertificateModal enrollment={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

function CertificateModal({ enrollment, onClose }: { enrollment: Enrollment; onClose: () => void }) {
  const { currentUser, courseById, userById, attempts } = useAppData()
  const course = courseById(enrollment.courseId)!
  const trainer = userById(course.trainerId)
  const certId = certificateId(enrollment.id)
  const verifyUrl = `${window.location.origin}/verify/${certId}`
  const best = bestAttemptPct(attempts, enrollment.traineeId, course.id)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:bg-white print:p-0" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto print:max-h-none print:rounded-none" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-2 p-3 border-b border-rule print:hidden">
          <Button variant="secondary" onClick={() => window.print()}><span className="flex items-center gap-2"><Printer size={16} /> Print / Save PDF</span></Button>
          <Button variant="ghost" onClick={onClose} aria-label="Close"><X size={18} /></Button>
        </div>
        <div className="p-4 sm:p-8">
          <div className="border-8 border-double border-navy p-5 sm:p-8 text-center relative">
            <div className="tricolor-strip absolute top-0 left-0" />
            <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">Government of India · Ministry of Earth Sciences</p>
            <p className="text-3xl font-serif font-bold text-navy mt-4">Certificate of Completion</p>
            <p className="text-slate-500 mt-6">This is to certify that</p>
            <p className="text-2xl font-semibold text-slate-800 mt-2 font-serif">{currentUser?.name}</p>
            <p className="text-slate-500 mt-4">has successfully completed the course</p>
            <p className="text-xl font-semibold text-slate-800 mt-2">{course.title}</p>
            <p className="text-sm text-slate-500 mt-1">
              {course.subject} · {course.durationWeeks} weeks{best !== null && ` · Assessment score ${best}%`}
            </p>
            <div className="flex flex-wrap items-end justify-center sm:justify-between mt-10 gap-6">
              <div className="text-left">
                <div className="border-t border-slate-400 pt-1 w-44">
                  <p className="text-sm font-medium text-slate-700">{trainer?.name}</p>
                  <p className="text-xs text-slate-500">Course Trainer</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <QRCodeSVG value={verifyUrl} size={88} fgColor="#0a3d62" />
                <p className="text-[10px] text-slate-500 mt-1">Scan to verify</p>
                <p className="text-[10px] font-mono text-slate-600">{certId}</p>
              </div>
              <div className="text-right">
                <div className="border-t border-slate-400 pt-1 w-44 ml-auto">
                  <p className="text-sm font-medium text-slate-700">Training Administrator</p>
                  <p className="text-xs text-slate-500">CAPACITY CONNECT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

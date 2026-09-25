import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShieldCheck, ShieldX, Search } from 'lucide-react'
import { GovLayout } from '../../components/layout/GovLayout'
import { PageBanner } from '../../components/gov/PageBanner'
import { Card, Button } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { bestAttemptPct, certificateId, isCertified } from '../../lib/metrics'

export function VerifyCertificate() {
  const { certId } = useParams()
  const navigate = useNavigate()
  const { enrollments, attempts, courseById, userById } = useAppData()
  const [input, setInput] = useState(certId ?? '')

  const match = certId
    ? enrollments.find((e) => certificateId(e.id) === certId.toUpperCase() && isCertified(e, courseById(e.courseId), attempts))
    : undefined
  const course = match && courseById(match.courseId)
  const holder = match && userById(match.traineeId)

  return (
    <GovLayout>
      <PageBanner title="Certificate Verification" subtitle="Check that a CAPACITY CONNECT certificate is genuine" crumbs={[{ label: 'Home', to: '/' }, { label: 'Verify Certificate' }]} scene="assessment" />
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

        <Card className="p-4">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); navigate(`/verify/${input.trim()}`) }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Certificate ID, e.g. CC-2026-E1"
                aria-label="Certificate ID"
                className="w-full border border-slate-400 pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
              />
            </div>
            <Button type="submit">Verify</Button>
          </form>
        </Card>

        {certId && (
          match && course && holder ? (
            <Card className="p-6 border-l-4 !border-l-indiagreen">
              <div className="flex items-center gap-2 text-indiagreen font-semibold">
                <ShieldCheck /> Valid certificate
              </div>
              <dl className="grid grid-cols-3 gap-y-3 mt-4 text-sm">
                <dt className="text-slate-500">Certificate ID</dt><dd className="col-span-2 font-mono">{certificateId(match.id)}</dd>
                <dt className="text-slate-500">Awarded to</dt><dd className="col-span-2 font-medium">{holder.name}</dd>
                <dt className="text-slate-500">Course</dt><dd className="col-span-2">{course.title}</dd>
                <dt className="text-slate-500">Subject</dt><dd className="col-span-2">{course.subject}</dd>
                {bestAttemptPct(attempts, holder.id, course.id) !== null && (
                  <><dt className="text-slate-500">Score</dt><dd className="col-span-2">{bestAttemptPct(attempts, holder.id, course.id)}%</dd></>
                )}
              </dl>
            </Card>
          ) : (
            <Card className="p-6 border-l-4 !border-l-red-500">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <ShieldX /> No valid certificate found
              </div>
              <p className="text-sm text-slate-500 mt-2">Check the ID for typos, or contact the issuing office.</p>
            </Card>
          )
        )}
      </div>
    </GovLayout>
  )
}

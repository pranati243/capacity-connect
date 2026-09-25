import { useState } from 'react'
import { Sparkles, Trophy, X } from 'lucide-react'
import { Card, CardHeader, Button, Avatar, Select, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { SUBJECTS } from '../../data/mockData'
import { rankTrainers, MATCH_WEIGHTS } from '../../lib/matching'
import type { CompetencyLevel, CompetencyEntry } from '../../types'

const LEVEL_STYLE: Record<CompetencyLevel, { bg: string; fg: string }> = {
  novice: { bg: '#cde2fb', fg: '#0b0b0b' },
  proficient: { bg: '#86b6ef', fg: '#0b0b0b' },
  expert: { bg: '#2a78d6', fg: '#ffffff' },
}

const DEFAULT_SCORE: Record<CompetencyLevel, number> = { novice: 45, proficient: 75, expert: 92 }

export function CompetencyMap() {
  const { users, competencyMap, courses, attempts, setCompetency, trainerRatingFor } = useAppData()
  const trainers = users.filter((u) => u.role === 'trainer' && u.status === 'approved')
  const [editing, setEditing] = useState<{ trainerId: string; subject: string } | null>(null)
  const [subject, setSubject] = useState(SUBJECTS[0])

  const entryFor = (trainerId: string, s: string) =>
    competencyMap.find((e) => e.trainerId === trainerId && e.subject === s)

  const ranked = rankTrainers(subject, trainers, competencyMap, courses, attempts, trainerRatingFor)

  const coverage = SUBJECTS.filter((s) => competencyMap.some((e) => e.subject === s && e.level !== 'novice')).length

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Badge tone={coverage === SUBJECTS.length ? 'success' : 'warning'}>
          {coverage}/{SUBJECTS.length} subjects have a proficient or expert trainer
        </Badge>
      </div>

      <Card>
        <CardHeader title="Trainer × subject matrix" subtitle="Click a cell to set or change a competency level" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-4 py-3 text-left font-medium sticky left-0 bg-slate-50">Trainer</th>
                {SUBJECTS.map((s) => (
                  <th key={s} className="px-2 py-3 font-medium text-xs text-center min-w-28">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.id} className="border-t border-rule">
                  <td className="px-4 py-3 sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.name} color={t.avatarColor} size={28} />
                      <span className="font-medium text-slate-800 whitespace-nowrap">{t.name}</span>
                    </div>
                  </td>
                  {SUBJECTS.map((s) => {
                    const e = entryFor(t.id, s)
                    return (
                      <td key={s} className="p-1.5">
                        <button
                          onClick={() => setEditing({ trainerId: t.id, subject: s })}
                          aria-label={`${t.name}, ${s}: ${e ? `${e.level} ${e.score}` : 'not mapped'}. Edit`}
                          className="w-full h-14 rounded-md text-xs font-medium flex flex-col items-center justify-center border-2 border-transparent hover:border-navy transition-colors"
                          style={e ? { background: LEVEL_STYLE[e.level].bg, color: LEVEL_STYLE[e.level].fg } : { background: '#f5f5f3', color: '#898781' }}
                        >
                          {e ? (
                            <>
                              <span className="capitalize">{e.level}</span>
                              <span className="opacity-80 tabular-nums">{e.score}</span>
                            </>
                          ) : (
                            '+ Map'
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-rule text-xs text-slate-600">
          {(Object.keys(LEVEL_STYLE) as CompetencyLevel[]).map((l) => (
            <span key={l} className="flex items-center gap-1.5 capitalize">
              <span className="w-4 h-4 rounded" style={{ background: LEVEL_STYLE[l].bg }} /> {l}
            </span>
          ))}
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-[#f5f5f3] border border-rule" /> Not mapped</span>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Find the right trainer"
          subtitle={`Ranked by competency score (${MATCH_WEIGHTS.competency * 100}%), trainee ratings (${MATCH_WEIGHTS.rating * 100}%) and assessment pass rate (${MATCH_WEIGHTS.passRate * 100}%)`}
          action={<Sparkles size={18} className="text-saffron-ink" />}
        />
        <div className="p-5 space-y-4">
          <div className="max-w-sm">
            <Select label="Subject" value={subject} onChange={setSubject} options={SUBJECTS.map((s) => ({ value: s, label: s }))} />
          </div>
          {ranked.length === 0 ? (
            <EmptyState text="No trainer is mapped to this subject yet. Map one in the matrix above." />
          ) : (
            <div className="space-y-3">
              {ranked.map((r, i) => (
                <div key={r.trainer.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${i === 0 ? 'border-indiagreen bg-green-50/50' : 'border-rule'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar name={r.trainer.name} color={r.trainer.avatarColor} />
                    <div>
                      <p className="font-medium text-slate-800 flex items-center gap-2">
                        {r.trainer.name}
                        {i === 0 && <span className="flex items-center gap-1 text-xs text-indiagreen"><Trophy size={12} /> Best match</span>}
                      </p>
                      <p className="text-xs text-slate-500">{r.trainer.profile.qualifications[0]}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div><p className="font-semibold text-slate-800 text-sm tabular-nums">{r.entry.score}</p><p className="text-slate-500">Competency</p></div>
                    <div><p className="font-semibold text-slate-800 text-sm tabular-nums">{r.rating ? r.rating.toFixed(1) : '—'}</p><p className="text-slate-500">Rating</p></div>
                    <div><p className="font-semibold text-slate-800 text-sm tabular-nums">{r.passRate === null ? '—' : `${r.passRate}%`}</p><p className="text-slate-500">Pass rate</p></div>
                  </div>
                  <div className="text-center sm:w-24">
                    <p className="text-2xl font-bold text-navy tabular-nums">{r.match}</p>
                    <p className="text-xs text-slate-500">Match score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {editing && (
        <EditCell
          key={`${editing.trainerId}-${editing.subject}`}
          trainerName={trainers.find((t) => t.id === editing.trainerId)?.name ?? ''}
          subject={editing.subject}
          entry={entryFor(editing.trainerId, editing.subject)}
          onSave={(level, score) => {
            setCompetency({ trainerId: editing.trainerId, subject: editing.subject, level, score })
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function EditCell({
  trainerName,
  subject,
  entry,
  onSave,
  onClose,
}: {
  trainerName: string
  subject: string
  entry?: CompetencyEntry
  onSave: (level: CompetencyLevel, score: number) => void
  onClose: () => void
}) {
  const [level, setLevel] = useState<CompetencyLevel>(entry?.level ?? 'proficient')
  const [score, setScore] = useState(entry?.score ?? DEFAULT_SCORE.proficient)

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-md" >
        <div onClick={(e) => e.stopPropagation()}>
          <CardHeader
            title="Set competency"
            subtitle={`${trainerName} · ${subject}`}
            action={<button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600"><X size={18} /></button>}
          />
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-2">
              {(['novice', 'proficient', 'expert'] as CompetencyLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLevel(l); setScore(DEFAULT_SCORE[l]) }}
                  className={`py-2 rounded-lg text-sm font-medium capitalize border-2 ${level === l ? 'border-navy' : 'border-transparent'}`}
                  style={{ background: LEVEL_STYLE[l].bg, color: LEVEL_STYLE[l].fg }}
                >
                  {l}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Competency score: <span className="tabular-nums">{score}</span>/100</span>
              <input type="range" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full mt-2 accent-navy" />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave(level, score)}>Save</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { X, Plus, Upload, FileCheck2, Pencil } from 'lucide-react'
import { Card, CardHeader, Button, TextArea, TextInput, Avatar, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import type { UserProfile } from '../../types'

type ListField = 'qualifications' | 'experience' | 'interests' | 'skills'

const LIST_FIELDS: { key: ListField; label: string; placeholder: string }[] = [
  { key: 'qualifications', label: 'Qualifications', placeholder: 'e.g. M.Sc. Meteorology' },
  { key: 'experience', label: 'Work Experience', placeholder: 'e.g. Scientist-B, IMD Pune (3 yrs)' },
  { key: 'skills', label: 'Skills', placeholder: 'e.g. Python, Radar calibration' },
  { key: 'interests', label: 'Interests', placeholder: 'e.g. Climate modelling' },
]

const LEVEL_TONE = { expert: 'success', proficient: 'info', novice: 'neutral' } as const

export function ProfilePage() {
  const { currentUser, updateProfile, competencyMap } = useAppData()
  const me = currentUser!
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState(me.profile.bio)

  const save = (patch: Partial<UserProfile>) => updateProfile(me.id, patch)
  const myCompetencies = competencyMap.filter((c) => c.trainerId === me.id)

  const filled = [
    me.profile.bio,
    ...LIST_FIELDS.map((f) => me.profile[f.key].length > 0),
    me.profile.certificates.length > 0,
  ].filter(Boolean).length
  const completeness = Math.round((filled / 6) * 100)

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
        <Avatar name={me.name} color={me.avatarColor} size={72} />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800">{me.name}</h2>
          <p className="text-sm text-slate-500">{me.email} · Joined {me.joinedAt}</p>
          {editingBio ? (
            <div className="mt-3 space-y-2">
              <TextArea label="About" value={bio} onChange={setBio} rows={2} />
              <div className="flex gap-2">
                <Button onClick={() => { save({ bio }); setEditingBio(false) }}>Save</Button>
                <Button variant="ghost" onClick={() => { setBio(me.profile.bio); setEditingBio(false) }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 mt-2 flex items-start gap-2">
              {me.profile.bio || <span className="italic text-slate-400">Add a short professional summary</span>}
              <button onClick={() => setEditingBio(true)} aria-label="Edit summary" className="text-slate-400 hover:text-navy">
                <Pencil size={14} />
              </button>
            </p>
          )}
        </div>
        <div className="sm:w-44">
          <p className="text-xs text-slate-500 mb-1">Profile completeness</p>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-indiagreen" style={{ width: `${completeness}%` }} />
          </div>
          <p className="text-sm font-semibold text-slate-700 mt-1">{completeness}%</p>
        </div>
      </Card>

      {me.role === 'trainer' && (
        <Card>
          <CardHeader title="Subject Competencies" subtitle="Verified by admin through the competency map" />
          <div className="p-5 flex flex-wrap gap-3">
            {myCompetencies.length === 0 && <EmptyState text="No competencies mapped yet." />}
            {myCompetencies.map((c) => (
              <div key={c.subject} className="border border-rule rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-slate-800">{c.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tone={LEVEL_TONE[c.level]}>{c.level}</Badge>
                  <span className="text-xs text-slate-500">Score {c.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LIST_FIELDS.map((f) => (
          <ListEditor
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            items={me.profile[f.key]}
            onChange={(items) => save({ [f.key]: items })}
          />
        ))}
      </div>

      <CertificatesEditor />
    </div>
  )
}

function ListEditor({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (!v) return
    onChange([...items, v])
    setDraft('')
  }
  return (
    <Card>
      <CardHeader title={label} />
      <div className="p-5">
        <div className="flex flex-wrap gap-2 min-h-8">
          {items.length === 0 && <span className="text-sm text-slate-400 italic">None added</span>}
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
              {item}
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${item}`} className="text-slate-400 hover:text-red-600">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <form className="flex gap-2 mt-4" onSubmit={(e) => { e.preventDefault(); add() }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            aria-label={`Add ${label}`}
            className="flex-1 border border-slate-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
          <Button type="submit" variant="secondary"><Plus size={16} /></Button>
        </form>
      </div>
    </Card>
  )
}

function CertificatesEditor() {
  const { currentUser, updateProfile } = useAppData()
  const me = currentUser!
  const [name, setName] = useState('')
  const [issuer, setIssuer] = useState('')
  const [year, setYear] = useState('')
  const [fileName, setFileName] = useState('')

  const add = () => {
    if (!name.trim() || !issuer.trim()) return
    updateProfile(me.id, {
      certificates: [
        ...me.profile.certificates,
        { id: `cert-${Date.now()}`, name: name.trim(), issuer: issuer.trim(), year: year.trim() },
      ],
    })
    setName('')
    setIssuer('')
    setYear('')
    setFileName('')
  }

  return (
    <Card>
      <CardHeader title="Certificates" subtitle="Upload external certifications to strengthen your profile" />
      <div className="p-5 space-y-4">
        {me.profile.certificates.length === 0 && <EmptyState text="No certificates uploaded." />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {me.profile.certificates.map((c) => (
            <div key={c.id} className="flex items-start gap-3 border border-rule rounded-lg p-3">
              <FileCheck2 size={20} className="text-indiagreen shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">{c.issuer}{c.year && ` · ${c.year}`}</p>
              </div>
              <button
                onClick={() => updateProfile(me.id, { certificates: me.profile.certificates.filter((x) => x.id !== c.id) })}
                aria-label={`Remove ${c.name}`}
                className="text-slate-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end pt-4 border-t border-rule" onSubmit={(e) => { e.preventDefault(); add() }}>
          <TextInput label="Certificate name" value={name} onChange={setName} required />
          <TextInput label="Issuing body" value={issuer} onChange={setIssuer} required />
          <TextInput label="Year" value={year} onChange={setYear} placeholder="2024" />
          <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 cursor-pointer hover:border-navy">
            <Upload size={16} />
            <span className="truncate">{fileName || 'Attach PDF'}</span>
            <input type="file" accept=".pdf,.jpg,.png" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
          </label>
          <Button type="submit" className="sm:col-span-4 sm:justify-self-start">Add certificate</Button>
        </form>
      </div>
    </Card>
  )
}

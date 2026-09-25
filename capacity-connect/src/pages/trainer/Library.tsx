import { useRef, useState } from 'react'
import { UploadCloud, PlayCircle, Presentation, FileText, CheckCircle2, ThumbsUp } from 'lucide-react'
import { Card, CardHeader, Button, TextInput, Select, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import type { ContentFeedback, Resource } from '../../types'

const TYPES: { value: Resource['type']; label: string; icon: typeof PlayCircle; accept: string }[] = [
  { value: 'lecture', label: 'Recorded lecture', icon: PlayCircle, accept: 'video/*' },
  { value: 'presentation', label: 'Presentation', icon: Presentation, accept: '.ppt,.pptx,.pdf' },
  { value: 'material', label: 'Study material', icon: FileText, accept: '.pdf,.doc,.docx,.xlsx,.csv,.zip' },
]

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function Library() {
  const { currentUser, courses, uploadResource, contentFeedback } = useAppData()
  const me = currentUser!
  const myCourses = courses.filter((c) => c.trainerId === me.id)
  const [courseId, setCourseId] = useState(myCourses[0]?.id ?? '')
  const [type, setType] = useState<Resource['type']>('lecture')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [filter, setFilter] = useState<'all' | Resource['type']>('all')
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const typeMeta = TYPES.find((t) => t.value === type)!

  const submit = () => {
    if (!courseId || !title.trim() || !file) return
    uploadResource(courseId, { title: title.trim(), type, sizeLabel: formatSize(file.size) })
    setMessage(`Uploaded "${title.trim()}". Enrolled trainees can access it now.`)
    setTitle('')
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-6 max-w-5xl">

      <Card>
        <CardHeader title="Upload resource" />
        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); submit() }}>
          {message && <p className="flex items-center gap-2 text-sm text-indiagreen bg-green-50 rounded-lg px-3 py-2"><CheckCircle2 size={16} /> {message}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="Course" value={courseId} onChange={setCourseId} options={myCourses.map((c) => ({ value: c.id, label: c.title }))} />
            <Select label="Resource type" value={type} onChange={(v) => setType(v as Resource['type'])} options={TYPES.map((t) => ({ value: t.value, label: t.label }))} />
            <TextInput label="Title" value={title} onChange={setTitle} placeholder="e.g. Week 3 - Radar reflectivity" required />
          </div>
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const f = e.dataTransfer.files?.[0]
              if (f) setFile(f)
            }}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-colors ${
              dragging ? 'border-navy bg-navy-50' : 'border-slate-300 hover:border-navy'
            }`}
          >
            <UploadCloud size={32} className="text-navy" />
            {file ? (
              <p className="text-sm font-medium text-slate-700">{file.name} <span className="text-slate-400">({formatSize(file.size)})</span></p>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700">Drag & drop a file, or click to browse</p>
                <p className="text-xs text-slate-400">{typeMeta.label}: {typeMeta.accept}</p>
              </>
            )}
            <input ref={inputRef} type="file" accept={typeMeta.accept} className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button type="submit" disabled={!courseId || !title.trim() || !file}>Upload to library</Button>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="My library"
          action={
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} aria-label="Filter by type" className="border border-slate-400 px-2 py-1 text-sm bg-white">
              <option value="all">All types</option>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          }
        />
        <div className="divide-y divide-rule">
          {myCourses.map((c) => {
            const items = c.resources.filter((r) => filter === 'all' || r.type === filter)
            return (
              <div key={c.id} className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{c.title}</p>
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No resources.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((r) => {
                      const Icon = TYPES.find((t) => t.value === r.type)!.icon
                      return (
                        <div key={r.id} className="flex items-center gap-3 border border-rule rounded-lg p-3">
                          <Icon size={20} className="text-navy shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                            <p className="text-xs text-slate-500">{r.sizeLabel} · {r.uploadedAt}</p>
                            <ContentFeedbackSummary items={contentFeedback.filter((f) => f.resourceId === r.id)} />
                          </div>
                          <Badge>{r.type}</Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {myCourses.length === 0 && <EmptyState text="No courses assigned." />}
        </div>
      </Card>
    </div>
  )
}

function ContentFeedbackSummary({ items }: { items: ContentFeedback[] }) {
  if (items.length === 0) return <p className="text-xs text-slate-400 mt-1">No trainee feedback yet</p>
  const helpful = items.filter((f) => f.helpful).length
  const latest = [...items].reverse().find((f) => f.comment)
  return (
    <div className="mt-1 text-xs">
      <p className="flex items-center gap-1 text-slate-700">
        <ThumbsUp size={12} className="text-indiagreen" /> {helpful} of {items.length} found it helpful
      </p>
      {latest && <p className="text-slate-500 italic mt-0.5 line-clamp-2">&ldquo;{latest.comment}&rdquo;</p>}
    </div>
  )
}

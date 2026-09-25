import { useState } from 'react'
import { Trash2, CheckCircle2, Star } from 'lucide-react'
import { Card, CardHeader, Button, TextInput, TextArea, Badge, EmptyState } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { PUBLISH_META } from '../../lib/publishMeta'
import type { PublishType } from '../../types'

export function Publish() {
  const { published, publish, unpublish, courses, userById } = useAppData()
  const [type, setType] = useState<PublishType>('announcement')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [done, setDone] = useState('')

  const submit = () => {
    if (!title.trim()) return
    publish({ type, title: title.trim(), body: body.trim() })
    setDone(`Published "${title.trim()}" to the homepage.`)
    setTitle('')
    setBody('')
  }

  const featuredTitles = new Set(published.filter((p) => p.type === 'content').map((p) => p.title))
  const recentResources = courses
    .flatMap((c) => c.resources.map((r) => ({ r, c })))
    .sort((a, b) => b.r.uploadedAt.localeCompare(a.r.uploadedAt))
    .slice(0, 6)

  const Meta = PUBLISH_META[type]
  const PreviewIcon = Meta.icon

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader title="New post" />
          <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); submit() }}>
            {done && <p className="flex items-center gap-2 text-sm text-indiagreen bg-green-50 rounded-lg px-3 py-2"><CheckCircle2 size={16} /> {done}</p>}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(PUBLISH_META) as PublishType[]).map((t) => {
                  const Icon = PUBLISH_META[t].icon
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-lg border-2 text-xs font-medium ${type === t ? 'border-navy bg-navy-50 text-navy' : 'border-rule text-slate-600'}`}
                    >
                      <Icon size={18} />
                      {PUBLISH_META[t].label}
                    </button>
                  )
                })}
              </div>
            </div>
            <TextInput label="Title" value={title} onChange={setTitle} required />
            <TextArea label="Details" value={body} onChange={setBody} rows={3} />
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Preview</p>
              <div className="flex gap-3 border border-rule rounded-lg p-4 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <PreviewIcon size={18} className="text-navy" />
                </div>
                <div>
                  <Badge tone={Meta.tone}>{Meta.label}</Badge>
                  <p className="font-semibold text-slate-800 mt-1">{title || 'Your title'}</p>
                  <p className="text-sm text-slate-500">{body || 'Details appear here.'}</p>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={!title.trim()}>Publish</Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Feature new learning content" subtitle="Recently uploaded by trainers" />
          <div className="divide-y divide-rule">
            {recentResources.map(({ r, c }) => {
              const postTitle = `New material: ${r.title}`
              const featured = featuredTitles.has(postTitle)
              return (
                <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                    <p className="text-xs text-slate-500 truncate">{c.title} · {r.uploadedAt}</p>
                  </div>
                  {featured ? (
                    <Badge tone="success">Featured</Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => publish({ type: 'content', title: postTitle, body: `Uploaded by ${userById(c.trainerId)?.name} to ${c.title}.` })}
                    >
                      <span className="flex items-center gap-1"><Star size={14} /> Feature</span>
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title={`Live on homepage (${published.length})`} />
        <div className="divide-y divide-rule">
          {published.length === 0 && <EmptyState text="Nothing published." />}
          {published.map((p) => {
            const m = PUBLISH_META[p.type]
            return (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <Badge tone={m.tone}>{m.label}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.date}</p>
                </div>
                <button onClick={() => unpublish(p.id)} aria-label={`Unpublish ${p.title}`} className="text-slate-400 hover:text-red-600 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

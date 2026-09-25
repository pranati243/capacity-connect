import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { usePrefs } from '../../context/PrefsContext'
import { PUBLISH_META } from '../../lib/publishMeta'

export function NewsTicker() {
  const { published } = useAppData()
  const { t } = usePrefs()
  const [paused, setPaused] = useState(false)
  if (published.length === 0) return null

  const items = published.slice(0, 6)
  const row = (dup: boolean) =>
    items.map((p) => (
      <span key={`${p.id}-${dup}`} className="inline-flex items-center gap-2 mr-10" aria-hidden={dup || undefined}>
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-saffron-ink bg-saffron-50 border border-saffron/40 px-1.5">
          {PUBLISH_META[p.type].label}
        </span>
        <span className="text-slate-800">{p.title}</span>
        <span className="text-slate-400 text-xs">({p.date})</span>
      </span>
    ))

  return (
    <div className="bg-white border-b border-rule">
      <div className={`max-w-7xl mx-auto flex items-stretch text-sm ${paused ? 'ticker-paused' : ''}`}>
        <div className="bg-saffron text-[#2b1600] font-bold px-4 flex items-center shrink-0 relative after:absolute after:right-[-10px] after:top-0 after:border-y-[18px] after:border-y-transparent after:border-l-[10px] after:border-l-saffron">
          {t('whatsNew')}
        </div>
        <div
          className="flex-1 overflow-hidden py-2 pl-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ticker-track whitespace-nowrap inline-block">
            {row(false)}
            {row(true)}
          </div>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-3 border-l border-rule text-navy hover:bg-navy-50"
          aria-label={paused ? t('play') : t('pause')}
          aria-pressed={paused}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  )
}

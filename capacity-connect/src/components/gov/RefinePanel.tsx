import { Search, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'

export function RefinePanel({
  query,
  onQuery,
  placeholder,
  children,
  onReset,
}: {
  query: string
  onQuery: (q: string) => void
  placeholder: string
  children: ReactNode
  onReset: () => void
}) {
  return (
    <aside className="bg-white border border-rule h-fit lg:sticky lg:top-4" aria-label="Refine results">
      <div className="flex items-center justify-between px-4 py-2.5 bg-navy text-white">
        <p className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal size={16} /> Refine results</p>
        <button onClick={onReset} className="text-xs underline text-white/80 hover:text-white">Reset</button>
      </div>
      <div className="p-4 border-b border-rule">
        <div className="relative">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full border border-slate-400 pl-8 pr-2 py-2 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </div>
      </div>
      {children}
    </aside>
  )
}

export function RefineGroup<T extends string>({
  title,
  options,
  selected,
  onChange,
  type = 'checkbox',
}: {
  title: string
  options: { value: T; label: string; count?: number }[]
  selected: T[]
  onChange: (next: T[]) => void
  type?: 'checkbox' | 'radio'
}) {
  return (
    <fieldset className="min-w-0 px-4 py-3 border-b border-rule last:border-b-0">
      <legend className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 pt-1">{title}</legend>
      <div className="space-y-1.5">
        {options.map((o) => {
          const checked = selected.includes(o.value)
          return (
            <label key={o.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type={type}
                name={title}
                checked={checked}
                onChange={() => {
                  if (type === 'radio') onChange([o.value])
                  else onChange(checked ? selected.filter((v) => v !== o.value) : [...selected, o.value])
                }}
                className="w-4 h-4 accent-[#0a3d62]"
              />
              <span className="flex-1">{o.label}</span>
              {o.count !== undefined && <span className="text-xs text-slate-400 tabular-nums">{o.count}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

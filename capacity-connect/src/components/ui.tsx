import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-white border border-rule ${className}`}>{children}</section>
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-3 bg-navy-50 border-b border-rule border-l-4 border-l-saffron">
      <div className="min-w-0">
        <h3 className="font-serif font-semibold text-navy text-[1.02rem] leading-snug">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Medallion({ icon: Icon, size = 44, tone = 'navy' }: { icon: LucideIcon; size?: number; tone?: 'navy' | 'saffron' | 'green' }) {
  const ring = { navy: '#0a3d62', saffron: '#f58220', green: '#138808' }[tone]
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0 bg-white"
      style={{ width: size, height: size, boxShadow: `0 0 0 2px ${ring}, 0 0 0 5px #fff, 0 0 0 6px ${ring}33` }}
    >
      <Icon size={size * 0.46} color={ring} strokeWidth={1.8} />
    </span>
  )
}

export function StatTile({
  label,
  value,
  hint,
  accent = 'navy',
  icon,
}: {
  label: string
  value: string | number
  hint?: string
  accent?: 'navy' | 'saffron' | 'green'
  icon?: LucideIcon
}) {
  const color = { navy: '#0a3d62', saffron: '#a4520b', green: '#138808' }[accent]
  const bar = { navy: '#0a3d62', saffron: '#f58220', green: '#138808' }[accent]
  return (
    <div className="bg-white border border-rule p-4 flex items-center gap-4 h-full" style={{ borderTop: `3px solid ${bar}` }}>
      {icon && <Medallion icon={icon} size={40} tone={accent} />}
      <div className="min-w-0">
        <p className="text-2xl font-bold tabular-nums leading-none" style={{ color }}>{value}</p>
        <p className="text-[0.8rem] text-slate-700 font-medium mt-1.5 leading-tight">{label}</p>
        {hint && <p className="text-[0.7rem] text-slate-500 mt-0.5">{hint}</p>}
      </div>
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const toneClass = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
    success: 'bg-green-50 text-green-800 border-green-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-300',
    danger: 'bg-red-50 text-red-800 border-red-300',
    info: 'bg-navy-50 text-navy border-blue-200',
  }[tone]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[0.7rem] font-semibold uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'saffron'
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  const variantClass = {
    primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
    secondary: 'bg-white text-navy border border-navy hover:bg-navy-50',
    ghost: 'text-navy border border-transparent hover:bg-navy-50',
    danger: 'bg-red-700 text-white border border-red-700 hover:bg-red-800',
    saffron: 'bg-saffron text-[#2b1600] border border-saffron hover:bg-[#e2721a]',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, tone = 'navy' }: { value: number; tone?: 'navy' | 'green' }) {
  const color = tone === 'green' ? '#138808' : '#0a3d62'
  return (
    <div className="w-full h-2 bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  )
}

const fieldClass =
  'mt-1 w-full border border-slate-400 bg-white px-3 py-2 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20'

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  hint,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  hint?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={fieldClass}
      />
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={fieldClass} />
    </label>
  )
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-slate-500 italic py-6 text-center">{text}</p>
}

export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter((p) => !p.endsWith('.'))
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0 border-2 border-white shadow-[0_0_0_1px_#d5dbe2]"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 border-b-2 border-navy pb-2">
      <h2 className="font-serif text-xl font-bold text-navy relative">
        {children}
        <span className="absolute -bottom-[10px] left-0 w-16 h-[3px] bg-saffron" aria-hidden="true" />
      </h2>
      {action}
    </div>
  )
}

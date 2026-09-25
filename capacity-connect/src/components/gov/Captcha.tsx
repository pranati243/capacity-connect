import { RefreshCw } from 'lucide-react'

export function Captcha({
  code,
  onRefresh,
  value,
  onChange,
}: {
  code: string
  onRefresh: () => void
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <span className="text-sm font-semibold text-slate-800">
        Security code <span className="text-red-700">*</span>
      </span>
      <div className="mt-1 flex items-stretch gap-2">
        <svg width="140" height="42" viewBox="0 0 140 42" className="border border-slate-400 bg-[#f1efe6] shrink-0 select-none" role="img" aria-label="Security code image">
          {[...Array(6)].map((_, i) => (
            <line key={i} x1={(i * 29) % 132} y1={(i * 13) % 42} x2={(i * 47 + 60) % 132} y2={((i + 3) * 17) % 42} stroke="#8aa0b6" strokeWidth="1" />
          ))}
          {code.split('').map((ch, i) => (
            <text
              key={i}
              x={18 + i * 23}
              y={29 + ((i * 7) % 5) - 2}
              fontSize="22"
              fontFamily="Noto Serif, Georgia, serif"
              fontWeight="700"
              fill={i % 2 ? '#0a3d62' : '#a4520b'}
              transform={`rotate(${((i * 37) % 30) - 15} ${24 + i * 23} 22)`}
            >
              {ch}
            </text>
          ))}
        </svg>
        <button type="button" onClick={onRefresh} className="px-3 border border-slate-400 text-navy hover:bg-navy-50" aria-label="Get a new security code" title="New code">
          <RefreshCw size={16} />
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          required
          maxLength={code.length}
          aria-label="Enter the security code shown"
          placeholder="Enter code"
          autoComplete="off"
          className="flex-1 min-w-0 border border-slate-400 px-3 text-sm uppercase tracking-[0.3em] font-semibold focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">Not case-sensitive. Click the refresh icon for a new code.</p>
    </div>
  )
}

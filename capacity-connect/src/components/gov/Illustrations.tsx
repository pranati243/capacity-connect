import type { CSSProperties } from 'react'

export type Tone = 'color' | 'mono'

interface Palette {
  sky: string
  skyLight: string
  ground: string
  ink: string
  inkSoft: string
  accent: string
  paper: string
  green: string
}

const COLOR: Palette = {
  sky: '#d6e6f5',
  skyLight: '#eaf2fa',
  ground: '#c9dcc1',
  ink: '#0a3d62',
  inkSoft: '#5a7fa0',
  accent: '#f58220',
  paper: '#ffffff',
  green: '#138808',
}

const MONO: Palette = {
  sky: 'transparent',
  skyLight: 'transparent',
  ground: 'currentColor',
  ink: 'currentColor',
  inkSoft: 'currentColor',
  accent: 'currentColor',
  paper: 'transparent',
  green: 'currentColor',
}

interface SceneProps {
  tone?: Tone
  className?: string
  style?: CSSProperties
  title?: string
}

function svgProps({ className, style, title }: SceneProps) {
  return {
    className: `illustration ${className ?? ''}`,
    style,
    role: title ? 'img' : undefined,
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
    xmlns: 'http://www.w3.org/2000/svg',
    preserveAspectRatio: 'xMidYMid slice',
  } as const
}

function Trainee({ x, y, s, p }: { x: number; y: number; s: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-34" r="12" fill={p.ink} />
      <path d="M-22 0 C-22 -18 -12 -22 0 -22 C12 -22 22 -18 22 0 Z" fill={p.ink} />
      <rect x="-30" y="0" width="60" height="8" fill={p.inkSoft} opacity="0.7" />
      <path d="M-14 -6 L10 -6 L14 0 L-18 0 Z" fill={p.accent} opacity="0.85" />
    </g>
  )
}

export function TrainingScene(props: SceneProps) {
  const p = props.tone === 'mono' ? MONO : COLOR
  const mono = props.tone === 'mono'
  return (
    <svg viewBox="0 0 600 320" {...svgProps(props)}>
      <rect width="600" height="320" fill={p.skyLight} />
      <rect y="292" width="600" height="28" fill={p.ground} opacity={mono ? 0.25 : 0.6} />
      {/* windows */}
      {[20, 110].map((wx) => (
        <g key={wx} opacity={mono ? 0.35 : 1}>
          <rect x={wx} y="30" width="70" height="90" fill={p.sky} stroke={p.inkSoft} strokeWidth="2" />
          <line x1={wx + 35} y1="30" x2={wx + 35} y2="120" stroke={p.inkSoft} strokeWidth="2" />
          <line x1={wx} y1="75" x2={wx + 70} y2="75" stroke={p.inkSoft} strokeWidth="2" />
        </g>
      ))}
      {/* projection screen with a synoptic chart */}
      <rect x="300" y="26" width="270" height="160" fill={p.paper} stroke={p.ink} strokeWidth="4" />
      <line x1="435" y1="186" x2="435" y2="206" stroke={p.ink} strokeWidth="4" />
      <g fill="none" stroke={p.inkSoft} strokeWidth="2" opacity="0.9">
        <ellipse cx="380" cy="100" rx="52" ry="38" />
        <ellipse cx="380" cy="100" rx="34" ry="24" />
        <ellipse cx="380" cy="100" rx="16" ry="11" />
        <path d="M430 60 C470 70 500 90 540 80" />
        <path d="M430 140 C470 130 500 150 545 140" />
      </g>
      <text x="374" y="106" fontSize="18" fontWeight="700" fill={p.accent} fontFamily="Noto Sans, sans-serif">L</text>
      <g fill={p.accent} opacity="0.9">
        <rect x="485" y="130" width="10" height="36" />
        <rect x="500" y="115" width="10" height="51" />
        <rect x="515" y="100" width="10" height="66" />
        <rect x="530" y="122" width="10" height="44" />
      </g>
      {/* presenter */}
      <g>
        <circle cx="262" cy="118" r="14" fill={p.ink} />
        <path d="M244 140 L280 140 L274 228 L250 228 Z" fill={p.ink} />
        <path d="M252 228 L248 292 M270 228 L274 292" stroke={p.ink} strokeWidth="9" strokeLinecap="round" />
        <path d="M277 146 L318 104" stroke={p.ink} strokeWidth="7" strokeLinecap="round" />
        <line x1="318" y1="104" x2="345" y2="84" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
        <rect x="236" y="148" width="12" height="3" fill={p.accent} />
      </g>
      {/* trainees */}
      <Trainee x={70} y={206} s={0.78} p={p} />
      <Trainee x={140} y={206} s={0.78} p={p} />
      <Trainee x={48} y={250} s={0.92} p={p} />
      <Trainee x={128} y={250} s={0.92} p={p} />
      <Trainee x={208} y={250} s={0.92} p={p} />
      <Trainee x={90} y={300} s={1.08} p={p} />
      <Trainee x={185} y={300} s={1.08} p={p} />
      <Trainee x={380} y={300} s={1.08} p={p} />
      <Trainee x={470} y={300} s={1.08} p={p} />
      <Trainee x={560} y={300} s={1.08} p={p} />
    </svg>
  )
}

function Cloud({ x, y, s, fill, opacity = 1 }: { x: number; y: number; s: number; fill: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} opacity={opacity}>
      <circle cx="0" cy="0" r="18" />
      <circle cx="22" cy="-10" r="24" />
      <circle cx="48" cy="0" r="18" />
      <rect x="0" y="0" width="48" height="18" />
    </g>
  )
}

export function WeatherScene(props: SceneProps) {
  const p = props.tone === 'mono' ? MONO : COLOR
  const mono = props.tone === 'mono'
  return (
    <svg viewBox="0 0 600 320" {...svgProps(props)}>
      <rect width="600" height="320" fill={p.sky} />
      <circle cx="505" cy="70" r="30" fill={p.accent} opacity={mono ? 0.35 : 0.85} />
      <Cloud x={470} y={82} s={1.2} fill={mono ? 'currentColor' : '#ffffff'} opacity={mono ? 0.3 : 1} />
      <Cloud x={250} y={60} s={0.9} fill={mono ? 'currentColor' : '#ffffff'} opacity={mono ? 0.25 : 0.95} />
      <g stroke={p.inkSoft} strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <line x1="488" y1="112" x2="482" y2="126" />
        <line x1="505" y1="112" x2="499" y2="126" />
        <line x1="522" y1="112" x2="516" y2="126" />
        <line x1="539" y1="112" x2="533" y2="126" />
      </g>
      {/* orbit + satellite */}
      <path d="M-20 120 C120 10 300 -10 420 30" fill="none" stroke={p.inkSoft} strokeWidth="2" strokeDasharray="6 6" opacity="0.7" />
      <g transform="translate(150 48) rotate(-18)">
        <rect x="-10" y="-8" width="20" height="16" fill={p.ink} />
        <g fill={mono ? 'currentColor' : '#2a78d6'} stroke={p.ink} strokeWidth="1.5" opacity={mono ? 0.6 : 1}>
          <rect x="-46" y="-6" width="32" height="12" />
          <rect x="14" y="-6" width="32" height="12" />
        </g>
        <line x1="0" y1="8" x2="0" y2="16" stroke={p.ink} strokeWidth="2" />
        <circle cx="0" cy="18" r="3" fill={p.accent} />
      </g>
      {/* ground */}
      <path d="M0 262 C120 238 220 250 320 244 C430 236 520 250 600 240 L600 320 L0 320 Z" fill={p.ground} opacity={mono ? 0.3 : 1} />
      {/* Doppler radar tower */}
      <g>
        <path d="M430 300 L446 168 L474 168 L490 300 Z" fill={p.ink} />
        <g stroke={p.paper} strokeWidth="2" opacity={mono ? 0 : 0.5}>
          <line x1="440" y1="220" x2="480" y2="220" />
          <line x1="436" y1="260" x2="484" y2="260" />
        </g>
        <circle cx="460" cy="138" r="38" fill={mono ? 'currentColor' : '#ffffff'} stroke={p.ink} strokeWidth="4" opacity={mono ? 0.7 : 1} />
        <g fill="none" stroke={p.inkSoft} strokeWidth="1.5">
          <path d="M422 138 L498 138" />
          <path d="M428 118 L492 118 M428 158 L492 158" />
          <path d="M460 100 L446 138 L460 176 L474 138 Z" />
        </g>
      </g>
      {/* anemometer + wind vane */}
      <g stroke={p.ink} strokeWidth="4" strokeLinecap="round">
        <line x1="300" y1="300" x2="300" y2="176" />
        <line x1="274" y1="176" x2="326" y2="176" />
      </g>
      <g fill={p.accent}>
        <path d="M266 176 a8 8 0 0 1 16 0 Z" />
        <path d="M318 176 a8 8 0 0 1 16 0 Z" />
        <path d="M292 168 a8 8 0 0 1 16 0 Z" />
      </g>
      <path d="M300 150 L330 150 L322 142 M300 150 L270 150 L262 144 L262 156 L270 150" stroke={p.ink} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <line x1="300" y1="176" x2="300" y2="150" stroke={p.ink} strokeWidth="3" />
      {/* Stevenson screen */}
      <g>
        <rect x="170" y="212" width="58" height="46" fill={mono ? 'currentColor' : '#ffffff'} stroke={p.ink} strokeWidth="3" opacity={mono ? 0.6 : 1} />
        <path d="M164 212 L199 196 L234 212 Z" fill={p.ink} />
        <g stroke={p.inkSoft} strokeWidth="2">
          {[222, 232, 242, 252].map((ly) => (
            <line key={ly} x1="176" y1={ly} x2="222" y2={ly} />
          ))}
        </g>
        <line x1="180" y1="258" x2="180" y2="292" stroke={p.ink} strokeWidth="4" />
        <line x1="218" y1="258" x2="218" y2="292" stroke={p.ink} strokeWidth="4" />
      </g>
      {/* rain gauge */}
      <g>
        <rect x="82" y="248" width="22" height="40" fill={p.inkSoft} />
        <rect x="78" y="244" width="30" height="6" fill={p.ink} />
      </g>
    </svg>
  )
}

export function LibraryScene(props: SceneProps) {
  const p = props.tone === 'mono' ? MONO : COLOR
  const mono = props.tone === 'mono'
  const books = [
    [40, 70, '#0a3d62'], [66, 90, '#f58220'], [84, 60, '#138808'], [110, 84, '#5a7fa0'], [130, 74, '#0a3d62'],
    [158, 92, '#b35900'], [176, 66, '#2a78d6'], [200, 80, '#0a3d62'],
  ] as const
  return (
    <svg viewBox="0 0 600 320" {...svgProps(props)}>
      <rect width="600" height="320" fill={p.skyLight} />
      {[150, 270].map((sy) => (
        <g key={sy}>
          <rect x="30" y={sy} width="200" height="8" fill={p.ink} />
          {books.map(([bx, bh, c], i) => (
            <rect key={i} x={bx} y={sy - bh * (sy === 150 ? 1 : 0.85)} width={i % 2 ? 16 : 22} height={bh * (sy === 150 ? 1 : 0.85)} fill={mono ? 'currentColor' : c} opacity={mono ? 0.3 + (i % 3) * 0.2 : 1} />
          ))}
        </g>
      ))}
      {/* video lecture monitor */}
      <rect x="290" y="50" width="250" height="160" fill={p.paper} stroke={p.ink} strokeWidth="5" />
      <rect x="400" y="210" width="30" height="36" fill={p.ink} />
      <rect x="370" y="246" width="90" height="8" fill={p.ink} />
      <circle cx="415" cy="130" r="36" fill={p.accent} opacity={mono ? 0.5 : 1} />
      <path d="M404 112 L434 130 L404 148 Z" fill={mono ? 'transparent' : '#ffffff'} stroke={mono ? 'currentColor' : 'none'} strokeWidth="3" />
      <rect x="310" y="188" width="210" height="6" fill={p.inkSoft} opacity="0.4" />
      <rect x="310" y="188" width="120" height="6" fill={p.accent} />
      {/* slide stack */}
      <g transform="translate(470 250) rotate(-6)">
        <rect x="0" y="0" width="90" height="56" fill={p.paper} stroke={p.ink} strokeWidth="3" />
        <rect x="10" y="10" width="44" height="6" fill={p.ink} />
        <rect x="10" y="24" width="68" height="4" fill={p.inkSoft} />
        <rect x="10" y="34" width="56" height="4" fill={p.inkSoft} />
      </g>
    </svg>
  )
}

export function AssessmentScene(props: SceneProps) {
  const p = props.tone === 'mono' ? MONO : COLOR
  const mono = props.tone === 'mono'
  return (
    <svg viewBox="0 0 600 320" {...svgProps(props)}>
      <rect width="600" height="320" fill={p.skyLight} />
      <rect x="200" y="40" width="200" height="260" fill={p.paper} stroke={p.ink} strokeWidth="5" />
      <rect x="255" y="26" width="90" height="28" fill={p.ink} />
      {[90, 145, 200, 255].map((ly, i) => (
        <g key={ly}>
          <rect x="222" y={ly - 14} width="26" height="26" fill="none" stroke={p.ink} strokeWidth="3" />
          {i < 3 && <path d={`M227 ${ly} L234 ${ly + 7} L246 ${ly - 8}`} fill="none" stroke={mono ? 'currentColor' : '#138808'} strokeWidth="4" strokeLinecap="round" />}
          <rect x="262" y={ly - 8} width={110 - i * 12} height="8" fill={p.inkSoft} opacity="0.6" />
        </g>
      ))}
      <circle cx="470" cy="110" r="52" fill={p.paper} stroke={p.ink} strokeWidth="5" />
      <path d="M470 110 L470 76 M470 110 L494 124" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M90 250 L150 190 L166 206 L106 266 L84 272 Z" fill={p.accent} opacity={mono ? 0.6 : 1} />
      <path d="M150 190 L160 180 L176 196 L166 206 Z" fill={p.ink} />
    </svg>
  )
}

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#0a3d62" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="24" cy="24" rx="8" ry="17" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
      <line x1="7" y1="24" x2="41" y2="24" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
      <path d="M13 32 L20 26 L25 29 L35 17" fill="none" stroke="#f58220" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 17 L35 17 L35 22" fill="none" stroke="#f58220" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { TrainingScene, WeatherScene, LibraryScene, AssessmentScene } from './Illustrations'
import type { SceneName } from './nav'
import type { Photo } from '../../lib/photos'

const SCENES = { training: TrainingScene, weather: WeatherScene, library: LibraryScene, assessment: AssessmentScene }

export interface Crumb {
  label: string
  to?: string
}

export function PageBanner({
  title,
  subtitle,
  crumbs,
  scene = 'training',
  large = false,
  photo,
  children,
}: {
  title: string
  subtitle?: string
  crumbs: Crumb[]
  scene?: SceneName
  large?: boolean
  photo?: Photo
  children?: ReactNode
}) {
  const Scene = SCENES[scene]
  return (
    <div className="relative overflow-hidden bg-navy text-white pattern-grid">
      {photo ? (
        <img
          src={photo.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-full md:w-2/3 h-full object-cover opacity-40 mix-blend-luminosity pointer-events-none"
        />
      ) : (
        <div
          className={`absolute inset-y-0 right-0 w-full text-white pointer-events-none ${large ? 'md:w-2/3 opacity-[0.24]' : 'md:w-3/5 opacity-[0.13]'}`}
          aria-hidden="true"
        >
          <Scene tone="mono" className="w-full h-full" />
        </div>
      )}
      <div
        className={`absolute inset-y-0 right-0 w-full pointer-events-none bg-gradient-to-r ${large ? 'md:w-2/3 from-navy via-navy/25 to-transparent' : 'md:w-3/5 from-navy via-navy/70 to-transparent'}`}
        aria-hidden="true"
      />
      <div className={`relative max-w-7xl mx-auto px-4 ${large ? 'py-10 md:py-14' : 'py-5'}`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-white/70">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                {c.to ? (
                  <Link to={c.to} className="hover:text-white hover:underline">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-white">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className={`font-serif font-bold mt-2 ${large ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{title}</h1>
        {subtitle && <p className="text-white/80 text-sm mt-1 max-w-2xl">{subtitle}</p>}
        {children}
      </div>
      <div className="h-1 bg-saffron relative" aria-hidden="true" />
    </div>
  )
}

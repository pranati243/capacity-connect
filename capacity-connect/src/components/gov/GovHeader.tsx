import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Moon, Sun, Menu, X, LogOut, Home as HomeIcon } from 'lucide-react'
import { Logo } from './Illustrations'
import { Avatar } from '../ui'
import { useAppData } from '../../context/AppDataContext'
import { usePrefs } from '../../context/PrefsContext'
import { PUBLIC_NAV, PORTAL_NAV, ROLE_LABEL, type NavItem } from './nav'
import type { Role } from '../../types'

function UtilityBar() {
  const { t, fontStep, setFontStep, toggleDarkMode, darkMode, lang, setLang } = usePrefs()
  const sizeBtn = 'px-1.5 py-0.5 hover:bg-white/15 font-semibold'
  return (
    <div className="bg-navy-dark text-white text-[0.72rem]">
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between gap-3">
        <span className="hidden sm:inline font-medium tracking-wide">
          भारत सरकार <span className="opacity-50 mx-1">|</span> Government of India
        </span>
        <div className="flex items-center gap-1 sm:gap-3 ml-auto">
          <a href="#main" className="hidden md:inline hover:underline">{t('skipToMain')}</a>
          <span className="hidden md:inline opacity-40">|</span>
          <Link to="/help#screen-reader" className="hidden md:inline hover:underline">{t('screenReader')}</Link>
          <span className="hidden md:inline opacity-40">|</span>
          <div className="flex items-center" role="group" aria-label={t('textSize')}>
            <button onClick={() => setFontStep(fontStep - 1)} className={sizeBtn} aria-label="Decrease text size">A-</button>
            <button onClick={() => setFontStep(1)} className={sizeBtn} aria-label="Reset text size">A</button>
            <button onClick={() => setFontStep(fontStep + 1)} className={sizeBtn} aria-label="Increase text size">A+</button>
          </div>
          <button
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
            aria-label={t('darkMode')}
            title={t('darkMode')}
            className="p-1 hover:bg-white/15"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <span className="opacity-40">|</span>
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-1.5 py-0.5 hover:bg-white/15 font-semibold" lang={lang === 'en' ? 'hi' : 'en'}>
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <span className="hidden sm:inline opacity-40">|</span>
          <Link to="/sitemap" className="hidden sm:inline hover:underline">{t('sitemap')}</Link>
        </div>
      </div>
    </div>
  )
}

function BrandBand({ role }: { role?: Role }) {
  const { t } = usePrefs()
  const { currentUser, logout } = useAppData()
  const navigate = useNavigate()
  return (
    <div className="bg-white border-b border-rule">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <Logo size={52} />
          <div className="min-w-0">
            <p className="font-serif font-bold text-navy text-xl sm:text-2xl leading-none tracking-wide">{t('portalName')}</p>
            <p className="text-[0.7rem] sm:text-xs text-slate-600 mt-1 leading-tight">{t('portalTagline')}</p>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-3 ml-auto border-l-4 border-saffron pl-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-slate-800" lang="hi">पृथ्वी विज्ञान मंत्रालय</p>
            <p className="text-sm font-semibold text-navy">Ministry of Earth Sciences</p>
            <p className="text-[0.7rem] text-slate-500">Government of India</p>
          </div>
        </div>
        <div className="ml-auto lg:ml-4 flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[0.7rem] text-saffron-ink font-semibold uppercase tracking-wide">{t(ROLE_LABEL[currentUser.role])}</p>
              </div>
              <Avatar name={currentUser.name} color={currentUser.avatarColor} size={38} />
              {!role && (
                <Link to={`/${currentUser.role}/dashboard`} className="hidden md:inline-block ml-1 bg-navy text-white text-xs font-semibold px-3 py-2 hover:bg-navy-dark">
                  {t('myPortal')}
                </Link>
              )}
              <button
                onClick={() => { logout(); navigate('/') }}
                className="ml-1 p-2 text-slate-600 hover:text-red-700 hover:bg-red-50"
                aria-label={t('logout')}
                title={t('logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex">
              <Link to="/login" className="bg-navy text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 hover:bg-navy-dark">{t('login')}</Link>
              <Link to="/signup" className="bg-saffron text-[#2b1600] text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 hover:bg-[#e2721a]">{t('register')}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NavBar({ items, role }: { items: NavItem[]; role?: Role }) {
  const { t } = usePrefs()
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const [lastPath, setLastPath] = useState(pathname + hash)
  if (lastPath !== pathname + hash) {
    setLastPath(pathname + hash)
    setOpen(false)
  }

  const isActive = (to: string) => {
    if (to.includes('#')) return pathname === '/' && hash === to.slice(to.indexOf('#'))
    if (to === '/') return pathname === '/' && !hash
    return pathname === to || pathname.startsWith(to + '/')
  }

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-[3px] transition-colors ${
      active ? 'border-saffron bg-white/10 text-white' : 'border-transparent text-white/90 hover:bg-white/10 hover:text-white'
    }`

  return (
    <nav className="bg-navy text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between lg:hidden h-12">
          <span className="text-sm font-semibold">{role ? t(ROLE_LABEL[role]) : t('navHome')}</span>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu" className="p-2 -mr-2 hover:bg-white/10">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <ul className={`${open ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row lg:items-stretch pb-2 lg:pb-0 lg:overflow-x-auto`}>
          {role && (
            <li>
              <Link to="/" className={linkClass(false)} aria-label={t('navHome')}>
                <HomeIcon size={16} />
                <span className="lg:hidden">{t('navHome')}</span>
              </Link>
            </li>
          )}
          {items.map((item) => (
            <li key={item.to}>
              {item.to.includes('#') ? (
                <a href={item.to} className={linkClass(isActive(item.to))}>{t(item.label)}</a>
              ) : (
                <NavLink to={item.to} className={linkClass(isActive(item.to))} end={item.to === '/'}>
                  {t(item.label)}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export function GovHeader({ role }: { role?: Role }) {
  return (
    <header>
      <div className="tricolor-strip" />
      <UtilityBar />
      <BrandBand role={role} />
      <NavBar items={role ? PORTAL_NAV[role] : PUBLIC_NAV} role={role} />
    </header>
  )
}

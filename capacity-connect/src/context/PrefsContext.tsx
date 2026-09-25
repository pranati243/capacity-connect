import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { usePersisted } from './storage'
import { translate, type Lang, type TKey } from '../i18n'

const FONT_SCALES = [87.5, 100, 112.5, 125]

interface Prefs {
  fontStep: number
  setFontStep: (n: number) => void
  highContrast: boolean
  toggleContrast: () => void
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey) => string
}

const PrefsContext = createContext<Prefs | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [fontStep, setFontStepRaw] = usePersisted<number>('fontStep', 1)
  const [highContrast, setHighContrast] = usePersisted<boolean>('highContrast', false)
  const [lang, setLang] = usePersisted<Lang>('lang', 'en')

  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${FONT_SCALES[fontStep] ?? 100}%`
    root.classList.toggle('hc', highContrast)
    root.lang = lang === 'hi' ? 'hi' : 'en'
  }, [fontStep, highContrast, lang])

  const value: Prefs = {
    fontStep,
    setFontStep: (n) => setFontStepRaw(Math.max(0, Math.min(FONT_SCALES.length - 1, n))),
    highContrast,
    toggleContrast: () => setHighContrast((v) => !v),
    lang,
    setLang,
    t: (key) => translate(lang, key),
  }
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}

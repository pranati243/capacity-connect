import type { ReactNode } from 'react'
import { GovHeader } from '../gov/GovHeader'
import { GovFooter } from '../gov/GovFooter'
import { NewsTicker } from '../gov/NewsTicker'

export function GovLayout({ children, ticker = false }: { children: ReactNode; ticker?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <a href="#main" className="skip-link">Skip to main content</a>
      <GovHeader />
      {ticker && <NewsTicker />}
      <main id="main" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <GovFooter />
    </div>
  )
}

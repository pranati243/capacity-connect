import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { GovHeader } from '../gov/GovHeader'
import { GovFooter } from '../gov/GovFooter'
import { PageBanner } from '../gov/PageBanner'
import { PORTAL_NAV, ROLE_LABEL } from '../gov/nav'
import { useAppData } from '../../context/AppDataContext'
import { usePrefs } from '../../context/PrefsContext'
import type { Role } from '../../types'

export function PortalLayout({ role }: { role: Role }) {
  const { currentUser } = useAppData()
  const { t } = usePrefs()
  const { pathname } = useLocation()

  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={`/${currentUser.role}/dashboard`} replace />

  const items = PORTAL_NAV[role]
  const item = items.find((i) => pathname === i.to || pathname.startsWith(i.to + '/')) ?? items[0]
  const isDashboard = item === items[0]
  const portal = t(ROLE_LABEL[role])
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <a href="#main" className="skip-link">{t('skipToMain')}</a>
      <GovHeader role={role} />
      {isDashboard ? (
        <PageBanner
          large
          scene="training"
          title={`${greeting}, ${currentUser.name}`}
          subtitle={[currentUser.department, currentUser.employeeId && `Employee ID ${currentUser.employeeId}`].filter(Boolean).join(' · ') || undefined}
          crumbs={[{ label: t('navHome'), to: '/' }, { label: portal }]}
        />
      ) : (
        <PageBanner
          title={t(item.label)}
          subtitle={item.subtitle}
          scene={item.scene}
          crumbs={[
            { label: t('navHome'), to: '/' },
            { label: portal, to: items[0].to },
            ...(pathname === item.to ? [{ label: t(item.label) }] : [{ label: t(item.label), to: item.to }, { label: 'Details' }]),
          ]}
        />
      )}
      <main id="main" tabIndex={-1} className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <GovFooter />
    </div>
  )
}

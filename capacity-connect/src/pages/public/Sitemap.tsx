import { Link } from 'react-router-dom'
import { GovLayout } from '../../components/layout/GovLayout'
import { PageBanner } from '../../components/gov/PageBanner'
import { Card, CardHeader } from '../../components/ui'
import { PORTAL_NAV } from '../../components/gov/nav'
import { usePrefs } from '../../context/PrefsContext'

export function Sitemap() {
  const { t } = usePrefs()
  const groups = [
    {
      title: 'Public',
      links: [
        ['/', t('navHome')], ['/login', t('login')], ['/signup', t('register')], ['/verify', t('navVerify')], ['/help', t('navHelp')],
      ],
    },
    { title: t('roleTrainee'), links: PORTAL_NAV.trainee.map((i) => [i.to, t(i.label)]) },
    { title: t('roleTrainer'), links: PORTAL_NAV.trainer.map((i) => [i.to, t(i.label)]) },
    { title: t('roleAdmin'), links: PORTAL_NAV.admin.map((i) => [i.to, t(i.label)]) },
  ]
  return (
    <GovLayout>
      <PageBanner title={t('sitemap')} crumbs={[{ label: t('navHome'), to: '/' }, { label: t('sitemap') }]} scene="library" />
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {groups.map((g) => (
          <Card key={g.title}>
            <CardHeader title={g.title} />
            <ul className="p-4 space-y-2 text-sm list-disc pl-8">
              {g.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-navy hover:underline">{label}</Link></li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="max-w-6xl mx-auto px-4 text-xs text-slate-500">Portal pages require login with the matching role.</p>
    </GovLayout>
  )
}

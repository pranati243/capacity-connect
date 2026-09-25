import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from './Illustrations'
import { usePrefs } from '../../context/PrefsContext'

const BUILD_DATE = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export function GovFooter() {
  const { t } = usePrefs()
  const heading = 'font-serif font-semibold text-white text-sm mb-3 pb-2 border-b border-white/15'
  const link = 'hover:text-white hover:underline'
  return (
    <footer className="bg-navy-dark text-white/75 text-sm mt-12">
      <div className="tricolor-strip" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Logo size={40} />
            <p className="font-serif font-bold text-white">{t('portalName')}</p>
          </div>
          <p className="text-xs leading-relaxed">{t('footerAbout')}</p>
        </div>
        <div>
          <p className={heading}>{t('quickLinks')}</p>
          <ul className="space-y-1.5">
            <li><Link to="/" className={link}>{t('navHome')}</Link></li>
            <li><a href="/#courses" className={link}>{t('navCourses')}</a></li>
            <li><a href="/#notices" className={link}>{t('navNotices')}</a></li>
            <li><Link to="/verify" className={link}>{t('navVerify')}</Link></li>
            <li><Link to="/sitemap" className={link}>{t('sitemap')}</Link></li>
          </ul>
        </div>
        <div>
          <p className={heading}>{t('policies')}</p>
          <ul className="space-y-1.5">
            <li><Link to="/help#accessibility" className={link}>Accessibility Statement</Link></li>
            <li><Link to="/help#privacy" className={link}>Privacy Policy</Link></li>
            <li><Link to="/help#terms" className={link}>Terms of Use</Link></li>
            <li><Link to="/help#hyperlinking" className={link}>Hyperlinking Policy</Link></li>
            <li><Link to="/help#faq" className={link}>Help &amp; FAQs</Link></li>
          </ul>
        </div>
        <div>
          <p className={heading}>{t('contactUs')}</p>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2"><MapPin size={14} className="shrink-0 mt-0.5" /> Training Division, Prithvi Bhavan, Lodhi Road, New Delhi</li>
            <li className="flex gap-2"><Mail size={14} className="shrink-0 mt-0.5" /> training-helpdesk [at] example [dot] gov [dot] in</li>
            <li className="flex gap-2"><Phone size={14} className="shrink-0 mt-0.5" /> Helpdesk: Mon–Fri, 9:30–17:30 IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-2 justify-between text-xs">
          <p>{t('contentOwned')} {t('prototypeNote')}.</p>
          <p className="shrink-0">{t('lastUpdated')}: {BUILD_DATE}</p>
        </div>
      </div>
    </footer>
  )
}

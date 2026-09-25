import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GovLayout } from '../../components/layout/GovLayout'
import { PageBanner } from '../../components/gov/PageBanner'
import { Card, CardHeader } from '../../components/ui'

const SECTIONS = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      ['How do I register?', 'Choose Register, select your role, fill in your official details and submit. An administrator approves the registration before you can log in.'],
      ['How is a certificate awarded?', 'Complete every learning resource in a course and score at least 60% in its assessment. The certificate appears under Certificates and can be printed or saved as PDF.'],
      ['Can I retake an assessment?', 'Each questionnaire allows one attempt before its deadline. Contact your trainer if you faced a technical problem.'],
      ['How can someone verify my certificate?', 'Every certificate carries a QR code and ID. Anyone can check it on the Verify Certificate page.'],
    ],
  },
  {
    id: 'screen-reader',
    title: 'Screen Reader Access',
    body: 'The portal follows WCAG 2.1 AA and GIGW 3.0. It works with free screen readers such as NVDA (Windows) and built-in readers such as VoiceOver (macOS/iOS) and TalkBack (Android). Use "Skip to main content" at the top of every page to bypass navigation.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility Statement',
    body: 'Text can be resized with A- / A / A+, a high-contrast mode is available from the header, all functions work with a keyboard, images carry text alternatives, and moving content (the news ticker and slideshow) can be paused.',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: 'Personal information collected at registration is used only to administer training. It is not shared with third parties except as required by law. Passwords are stored only as salted hashes.',
  },
  {
    id: 'terms',
    title: 'Terms of Use',
    body: 'This portal is for official training use. Content is owned by the Ministry and may not be reproduced for commercial purposes without permission.',
  },
  {
    id: 'hyperlinking',
    title: 'Hyperlinking Policy',
    body: 'Prior permission is not required to link to this portal, but the portal must not be loaded into frames on other sites. Links to external sites are provided for convenience only.',
  },
] as const

export function Help() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <GovLayout>
      <PageBanner title="Help & Policies" subtitle="FAQs, accessibility and website policies" crumbs={[{ label: 'Home', to: '/' }, { label: 'Help' }]} scene="library" />
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <nav aria-label="On this page" className="lg:sticky lg:top-4 h-fit bg-white border border-rule">
          <p className="px-4 py-2.5 bg-navy text-white text-sm font-semibold">On this page</p>
          <ul className="text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className={`block px-4 py-2 border-b border-rule hover:bg-navy-50 ${hash === '#' + s.id ? 'text-navy font-semibold border-l-4 border-l-saffron' : 'text-slate-700'}`}>{s.title}</a></li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-3 space-y-5">
          {SECTIONS.map((s) => (
            <Card key={s.id} className="scroll-mt-4">
              <div id={s.id} className="scroll-mt-4" />
              <CardHeader title={s.title} />
              <div className="p-5 text-sm text-slate-700 leading-relaxed">
                {'items' in s ? (
                  <dl className="space-y-4">
                    {s.items.map(([q, a]) => (
                      <div key={q}>
                        <dt className="font-semibold text-slate-900">{q}</dt>
                        <dd className="mt-1">{a}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p>{s.body}</p>
                )}
              </div>
            </Card>
          ))}
          <p className="text-xs text-slate-500">Policy text is indicative for this prototype and would be replaced by the Ministry's approved policies.</p>
        </div>
      </div>
    </GovLayout>
  )
}

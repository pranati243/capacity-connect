import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Library, ClipboardCheck, ShieldCheck, UserPlus, Network, ChevronLeft, ChevronRight, Pause, Play,
  Trophy, FileText, GraduationCap, Users, Award, UserCog, ArrowRight,
} from 'lucide-react'
import { GovLayout } from '../../components/layout/GovLayout'
import { PHOTOS, type Photo } from '../../lib/photos'
import { SubjectCover } from '../../components/gov/SubjectCover'
import { Medallion, SectionTitle, Badge } from '../../components/ui'
import { useAppData } from '../../context/AppDataContext'
import { usePrefs } from '../../context/PrefsContext'
import { PUBLISH_META } from '../../lib/publishMeta'
import { isCertified } from '../../lib/metrics'
import type { PublishedItem } from '../../types'

const SLIDES = [
  {
    photo: PHOTOS.lecture as Photo,
    kicker: 'Capacity Building',
    title: 'heroTitle' as const,
    body: 'heroBody' as const,
    cta: { label: 'Register Now', to: '/signup' },
  },
  {
    photo: PHOTOS.radar as Photo,
    kicker: 'Learn from the field',
    titleText: 'Courses taught by the scientists who run the observation network',
    bodyText: 'Instruments, radar and satellite systems, forecasting models and climate data — mapped to verified trainer competencies.',
    cta: { label: 'Explore Courses', to: '/#courses' },
  },
  {
    photo: PHOTOS.handsOn as Photo,
    kicker: 'Assess & Certify',
    titleText: 'Subject-wise assessments and QR-verifiable certificates',
    bodyText: 'Every certificate issued on this portal can be verified by anyone, anytime, with its certificate ID.',
    cta: { label: 'Verify a Certificate', to: '/verify' },
  },
]

const ctaClass = 'inline-flex items-center gap-2 mt-6 bg-white text-navy font-semibold px-5 py-2.5 hover:bg-saffron-50'

function HeroCarousel() {
  const { t } = usePrefs()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000)
    return () => clearInterval(id)
  }, [paused])

  const slide = SLIDES[index]
  const title = 'title' in slide && slide.title ? t(slide.title) : slide.titleText
  const body = 'body' in slide && slide.body ? t(slide.body) : slide.bodyText

  return (
    <section className="relative bg-navy overflow-hidden" aria-roledescription="carousel" aria-label="Highlights">
      <div className="relative h-[460px] sm:h-[380px] md:h-[400px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== index}
          >
            <img
              src={s.photo.src}
              alt={s.photo.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
            <p className="absolute top-2 right-3 text-[0.65rem] text-white/80 bg-black/35 px-1.5 py-0.5 z-10">
              Photo: {s.photo.author}, {s.photo.license}
            </p>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 md:via-navy/60 to-navy/20" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-xl text-white" aria-live={paused ? 'polite' : 'off'}>
            <p className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#2b1600] bg-saffron px-2 py-1">{slide.kicker}</p>
            <h2 className="font-serif text-2xl md:text-4xl font-bold mt-4 leading-tight">{title}</h2>
            <p className="text-white/85 mt-3 md:text-lg">{body}</p>
            {slide.cta.to.startsWith('/#') ? (
              <a href={slide.cta.to} className={ctaClass}>{slide.cta.label} <ArrowRight size={16} /></a>
            ) : (
              <Link to={slide.cta.to} className={ctaClass}>{slide.cta.label} <ArrowRight size={16} /></Link>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 md:bottom-12 right-4 flex items-center gap-1">
        <button onClick={() => setIndex((index + SLIDES.length - 1) % SLIDES.length)} className="p-1.5 bg-white/15 text-white hover:bg-white/30" aria-label="Previous slide"><ChevronLeft size={18} /></button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 mx-0.5 border border-transparent transition-all ${i === index ? 'w-7 bg-saffron' : 'w-2.5 bg-white/60'}`}
          />
        ))}
        <button onClick={() => setIndex((index + 1) % SLIDES.length)} className="p-1.5 bg-white/15 text-white hover:bg-white/30" aria-label="Next slide"><ChevronRight size={18} /></button>
        <button onClick={() => setPaused((p) => !p)} className="p-1.5 bg-white/15 text-white hover:bg-white/30 ml-1" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
    </section>
  )
}

const SERVICES = [
  { icon: BookOpen, title: 'Course Catalogue', text: 'Browse and enrol in training programmes', to: '/trainee/courses' },
  { icon: Library, title: 'Trainer Library', text: 'Lectures, presentations and study material', to: '/trainee/library' },
  { icon: ClipboardCheck, title: 'Assessments', text: 'Subject-wise MCQ tests with deadlines', to: '/trainee/assessments' },
  { icon: ShieldCheck, title: 'Verify Certificate', text: 'Check any certificate by its ID or QR', to: '/verify' },
  { icon: UserPlus, title: 'Become a Trainer', text: 'Share your expertise with colleagues', to: '/signup' },
  { icon: Network, title: 'Competency Mapping', text: 'Right trainer for every subject', to: '/admin/competency-map' },
]

function DateBlock({ date }: { date: string }) {
  const d = new Date(date + 'T00:00:00')
  return (
    <div className="w-12 shrink-0 text-center border border-rule bg-white">
      <p className="text-[0.6rem] font-bold uppercase bg-navy text-white py-0.5">{d.toLocaleString('en-IN', { month: 'short' })}</p>
      <p className="font-serif text-lg font-bold text-navy leading-7">{d.getDate()}</p>
    </div>
  )
}

function NoticeList({ items, empty }: { items: PublishedItem[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-slate-500 italic p-4">{empty}</p>
  const newest = items[0]?.date
  return (
    <ul className="divide-y divide-rule">
      {items.map((p) => (
        <li key={p.id} className="flex gap-3 p-4">
          <DateBlock date={p.date} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 leading-snug">
              {p.title}
              {p.date === newest && <span className="ml-2 align-middle text-[0.6rem] font-bold text-white bg-red-700 px-1.5 py-0.5 uppercase">New</span>}
            </p>
            {p.body && <p className="text-sm text-slate-600 mt-0.5">{p.body}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Trophy; children: ReactNode }) {
  return (
    <section className="bg-white border border-rule flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 bg-navy text-white border-b-[3px] border-saffron">
        <Icon size={18} />
        <h3 className="font-serif font-semibold">{title}</h3>
      </div>
      <div className="flex-1 max-h-[420px] overflow-y-auto">{children}</div>
    </section>
  )
}

export function Home() {
  const { published, courses, users, enrollments, attempts, courseById, userById } = useAppData()
  const { t } = usePrefs()

  const trainees = users.filter((u) => u.role === 'trainee' && u.status === 'approved').length
  const trainers = users.filter((u) => u.role === 'trainer' && u.status === 'approved').length
  const certificates = enrollments.filter((e) => isCertified(e, courseById(e.courseId), attempts)).length
  const resources = courses.reduce((s, c) => s + c.resources.length, 0)

  const notices = published.filter((p) => p.type === 'announcement' || p.type === 'notification')
  const achievements = published.filter((p) => p.type === 'achievement')
  const content = published.filter((p) => p.type === 'content')

  return (
    <GovLayout ticker>
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 mt-4 md:-mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-rule bg-white shadow-[0_6px_20px_rgba(10,61,98,0.12)]">
          {SERVICES.map((s) => (
            <Link key={s.title} to={s.to} className="group flex flex-col items-center text-center gap-2 p-5 border-r border-b lg:border-b-0 border-rule hover:bg-navy transition-colors">
              <span className="group-hover:scale-105 transition-transform"><Medallion icon={s.icon} size={48} /></span>
              <p className="font-semibold text-navy group-hover:text-white text-sm">{s.title}</p>
              <p className="text-xs text-slate-500 group-hover:text-white/80 leading-snug">{s.text}</p>
            </Link>
          ))}
        </div>
      </div>

      <div id="notices" className="max-w-7xl mx-auto px-4 pt-12 scroll-mt-4">
        <SectionTitle>{t('navNotices')}</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Panel title={t('announcements')} icon={PUBLISH_META.announcement.icon}>
            <NoticeList items={notices} empty="No announcements." />
          </Panel>
          <Panel title={t('achievements')} icon={Trophy}>
            <NoticeList items={achievements} empty="No achievements published yet." />
          </Panel>
          <Panel title={t('newContent')} icon={FileText}>
            <NoticeList items={content} empty="No new content featured yet." />
          </Panel>
        </div>
      </div>

      <section className="mt-12 bg-navy pattern-grid text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="font-serif text-lg font-semibold mb-5 text-center">{t('atAGlance')}</p>
          <dl className="grid grid-cols-2 md:grid-cols-5 gap-y-6">
            {[
              [BookOpen, courses.length, 'Courses'],
              [GraduationCap, trainees, 'Trainees'],
              [Users, trainers, 'Trainers'],
              [Award, certificates, 'Certificates Issued'],
              [Library, resources, 'Learning Resources'],
            ].map(([Icon, n, label]) => {
              const I = Icon as typeof BookOpen
              return (
                <div key={label as string} className="text-center md:border-r last:border-r-0 border-white/15">
                  <I size={22} className="mx-auto text-saffron" />
                  <dd className="font-serif text-3xl font-bold mt-1 tabular-nums">{n as number}</dd>
                  <dt className="text-xs uppercase tracking-wider text-white/75">{label as string}</dt>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 pt-12 scroll-mt-4">
        <SectionTitle>{t('navAbout')}</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="border border-rule bg-white p-2">
            <figure>
              <img src={PHOTOS.participants.src} alt={PHOTOS.participants.alt} loading="lazy" className="w-full h-auto aspect-[3/2] object-cover" />
              <figcaption className="text-[0.7rem] text-slate-500 px-1 pt-1.5">
                Capacity building workshop in progress. Photo: {PHOTOS.participants.author}, {PHOTOS.participants.license}
              </figcaption>
            </figure>
          </div>
          <div>
            <p className="text-slate-700 leading-relaxed">
              Training records at many offices still live in emails and spreadsheets. {t('portalName')} brings enrolment, learning material,
              assessments, feedback and certification into one place, and maps every trainer's competencies so the right expert teaches each subject.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                [GraduationCap, 'Trainees', 'Build a profile, enrol, learn, take assessments and earn certificates.'],
                [UserCog, 'Trainers', 'Publish lectures and material, set questionnaires, track performance.'],
                [ShieldCheck, 'Administrators', 'Approve users, assign roles, monitor dashboards and publish updates.'],
              ].map(([Icon, title, text]) => (
                <div key={title as string} className="border-t-[3px] border-navy bg-white border-x border-b border-x-rule border-b-rule p-4">
                  <Medallion icon={Icon as typeof BookOpen} size={38} tone="saffron" />
                  <p className="font-serif font-semibold text-navy mt-3">{title as string}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="max-w-7xl mx-auto px-4 pt-12 scroll-mt-4">
        <SectionTitle action={<Link to="/trainee/courses" className="text-sm font-semibold text-navy hover:underline">{t('viewAll')} →</Link>}>
          {t('featuredCourses')}
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 8).map((c) => {
            const trainer = userById(c.trainerId)
            const enrolled = enrollments.filter((e) => e.courseId === c.id).length
            return (
              <article key={c.id} className="bg-white border border-rule flex flex-col hover:border-navy transition-colors">
                <SubjectCover subject={c.subject} className="h-32 border-b border-rule" />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-serif font-semibold text-navy leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">{c.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge>{c.level}</Badge>
                    <Badge>{c.durationWeeks} weeks</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-rule text-xs text-slate-600">
                  <span className="truncate">{trainer?.name}</span>
                  <span className="shrink-0">{enrolled} enrolled</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </GovLayout>
  )
}

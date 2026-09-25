import type { Role } from '../../types'
import type { TKey } from '../../i18n'
import type { Tone } from './Illustrations'

export type SceneName = 'training' | 'weather' | 'library' | 'assessment'

export interface NavItem {
  to: string
  label: TKey
  subtitle?: string
  scene?: SceneName
  tone?: Tone
}

export const PUBLIC_NAV: NavItem[] = [
  { to: '/', label: 'navHome' },
  { to: '/#about', label: 'navAbout' },
  { to: '/#courses', label: 'navCourses' },
  { to: '/#notices', label: 'navNotices' },
  { to: '/verify', label: 'navVerify' },
  { to: '/help', label: 'navHelp' },
]

export const PORTAL_NAV: Record<Role, NavItem[]> = {
  trainee: [
    { to: '/trainee/dashboard', label: 'navDashboard', scene: 'training' },
    { to: '/trainee/courses', label: 'navCourses', subtitle: 'Browse the catalogue, enrol, and continue your courses', scene: 'weather' },
    { to: '/trainee/library', label: 'navLibrary', subtitle: 'Recorded lectures, presentations and study material shared by trainers', scene: 'library' },
    { to: '/trainee/assessments', label: 'navAssessments', subtitle: 'Subject-wise MCQ assessments, deadlines and results', scene: 'assessment' },
    { to: '/trainee/certificates', label: 'navCertificates', subtitle: 'Certificates earned on course completion, verifiable by QR code', scene: 'assessment' },
    { to: '/trainee/profile', label: 'navProfile', subtitle: 'Qualifications, experience, interests, skills and certificates', scene: 'training' },
  ],
  trainer: [
    { to: '/trainer/dashboard', label: 'navDashboard', scene: 'training' },
    { to: '/trainer/questionnaires', label: 'navQuestionnaires', subtitle: 'Create subject-wise MCQ questionnaires with submission deadlines', scene: 'assessment' },
    { to: '/trainer/performance', label: 'navPerformance', subtitle: 'Participation, scores and integrity flags across your courses', scene: 'assessment' },
    { to: '/trainer/library', label: 'navLibrary', subtitle: 'Upload recorded lectures, presentations and study material for trainees', scene: 'library' },
    { to: '/trainer/profile', label: 'navProfile', subtitle: 'Your professional profile and verified subject competencies', scene: 'training' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'navDashboard', scene: 'training' },
    { to: '/admin/approvals', label: 'navApprovals', subtitle: 'Approve registrations and manage user roles', scene: 'training' },
    { to: '/admin/courses', label: 'navCourseMgmt', subtitle: 'Create courses and assign the best-matched trainer', scene: 'weather' },
    { to: '/admin/competency-map', label: 'navCompetency', subtitle: 'Which trainer can teach which subject, and how well', scene: 'weather' },
    { to: '/admin/publish', label: 'navPublish', subtitle: 'Notifications, announcements, achievements and new learning content for the homepage', scene: 'library' },
  ],
}

export const ROLE_LABEL: Record<Role, TKey> = {
  trainee: 'roleTrainee',
  trainer: 'roleTrainer',
  admin: 'roleAdmin',
}

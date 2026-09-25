import { createContext, useContext, type ReactNode } from 'react'
import type {
  AppUser,
  Course,
  Enrollment,
  Attempt,
  Feedback,
  ContentFeedback,
  CompetencyEntry,
  PublishedItem,
  Questionnaire,
  Resource,
  Role,
  UserProfile,
} from '../types'
import {
  seedUsers,
  seedCourses,
  seedEnrollments,
  seedAttempts,
  seedFeedback,
  seedContentFeedback,
  seedCompetencyMap,
  seedPublished,
} from '../data/mockData'
import { usePersisted } from './storage'
import { hashPassword } from '../lib/auth'

interface SignupInput {
  name: string
  email: string
  role: Role
  password: string
  employeeId: string
  department: string
}

export type LoginResult =
  | { ok: true; user: AppUser }
  | { ok: false; reason: 'not_found' | 'bad_password' | 'pending' | 'rejected' }

type NewCourse = Omit<Course, 'id' | 'resources' | 'questionnaires' | 'createdAt'>

interface AppDataApi {
  users: AppUser[]
  courses: Course[]
  enrollments: Enrollment[]
  attempts: Attempt[]
  feedback: Feedback[]
  contentFeedback: ContentFeedback[]
  competencyMap: CompetencyEntry[]
  published: PublishedItem[]
  currentUser: AppUser | null
  loginWithPassword: (email: string, password: string) => Promise<LoginResult>
  loginDemoAccount: (email: string) => AppUser | undefined
  logout: () => void
  signup: (input: SignupInput) => Promise<AppUser>
  approveUser: (id: string) => void
  rejectUser: (id: string) => void
  changeUserRole: (id: string, role: Role) => void
  updateProfile: (id: string, profile: Partial<UserProfile>) => void
  enroll: (courseId: string, traineeId: string) => void
  toggleResource: (enrollmentId: string, resourceId: string, totalResources: number) => void
  submitAttempt: (input: Omit<Attempt, 'id' | 'submittedAt'>) => void
  submitFeedback: (input: Omit<Feedback, 'id' | 'submittedAt'>) => void
  submitContentFeedback: (input: Omit<ContentFeedback, 'id' | 'submittedAt'>) => void
  createCourse: (input: NewCourse) => Course
  assignTrainer: (courseId: string, trainerId: string) => void
  createQuestionnaire: (courseId: string, q: Omit<Questionnaire, 'id' | 'courseId' | 'createdAt'>) => void
  uploadResource: (courseId: string, resource: Omit<Resource, 'id' | 'uploadedAt'>) => void
  publish: (item: Omit<PublishedItem, 'id' | 'date'>) => void
  unpublish: (id: string) => void
  setCompetency: (entry: CompetencyEntry) => void
  courseById: (id: string) => Course | undefined
  userById: (id: string) => AppUser | undefined
  trainerRatingFor: (trainerId: string) => number | null
}

const AppDataContext = createContext<AppDataApi | null>(null)

const AVATAR_COLORS = ['#0A3D62', '#146C43', '#8A4B08', '#B33951', '#5B4B8A', '#2E86AB']

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

const today = () => new Date().toISOString().slice(0, 10)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = usePersisted<AppUser[]>('users', seedUsers)
  const [courses, setCourses] = usePersisted<Course[]>('courses', seedCourses)
  const [enrollments, setEnrollments] = usePersisted<Enrollment[]>('enrollments', seedEnrollments)
  const [attempts, setAttempts] = usePersisted<Attempt[]>('attempts', seedAttempts)
  const [feedback, setFeedback] = usePersisted<Feedback[]>('feedback', seedFeedback)
  const [contentFeedback, setContentFeedback] = usePersisted<ContentFeedback[]>('contentFeedback', seedContentFeedback)
  const [competencyMap, setCompetencyMap] = usePersisted<CompetencyEntry[]>('competency', seedCompetencyMap)
  const [published, setPublished] = usePersisted<PublishedItem[]>('published', seedPublished)
  const [currentUserId, setCurrentUserId] = usePersisted<string | null>('session', null)
  const currentUser = users.find((u) => u.id === currentUserId) ?? null

  const courseById = (id: string) => courses.find((c) => c.id === id)
  const userById = (id: string) => users.find((u) => u.id === id)
  const findByEmail = (email: string) => users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

  const trainerRatingFor = (trainerId: string) => {
    const trainerCourses = courses.filter((c) => c.trainerId === trainerId).map((c) => c.id)
    const relevant = feedback.filter((f) => trainerCourses.includes(f.courseId))
    if (relevant.length === 0) return null
    return relevant.reduce((sum, f) => sum + f.rating, 0) / relevant.length
  }

  const updateCourse = (courseId: string, fn: (c: Course) => Course) =>
    setCourses((prev) => prev.map((c) => (c.id === courseId ? fn(c) : c)))

  const api: AppDataApi = {
    users,
    courses,
    enrollments,
    attempts,
    feedback,
    contentFeedback,
    competencyMap,
    published,
    currentUser,
    courseById,
    userById,
    trainerRatingFor,

    loginWithPassword: async (email, password) => {
      const user = findByEmail(email)
      if (!user) return { ok: false, reason: 'not_found' }
      if ((await hashPassword(user.email, password)) !== user.passwordHash) return { ok: false, reason: 'bad_password' }
      if (user.status === 'pending') return { ok: false, reason: 'pending' }
      if (user.status === 'rejected') return { ok: false, reason: 'rejected' }
      setCurrentUserId(user.id)
      return { ok: true, user }
    },
    loginDemoAccount: (email) => {
      const user = findByEmail(email)
      if (user?.status === 'approved') setCurrentUserId(user.id)
      return user
    },
    logout: () => setCurrentUserId(null),
    signup: async (input) => {
      const newUser: AppUser = {
        id: nextId('u'),
        name: input.name,
        email: input.email.trim(),
        role: input.role,
        status: 'pending',
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        joinedAt: today(),
        passwordHash: await hashPassword(input.email, input.password),
        employeeId: input.employeeId,
        department: input.department,
        profile: { qualifications: [], experience: [], interests: [], skills: [], certificates: [], bio: '' },
      }
      setUsers((prev) => [...prev, newUser])
      return newUser
    },
    approveUser: (id) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'approved' } : u))),
    rejectUser: (id) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'rejected' } : u))),
    changeUserRole: (id, role) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u))),
    updateProfile: (id, profile) =>
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, profile: { ...u.profile, ...profile } } : u))),

    enroll: (courseId, traineeId) =>
      setEnrollments((prev) => {
        if (prev.some((e) => e.courseId === courseId && e.traineeId === traineeId)) return prev
        return [...prev, { id: nextId('e'), courseId, traineeId, enrolledAt: today(), progress: 0, completedResources: [] }]
      }),
    toggleResource: (enrollmentId, resourceId, totalResources) =>
      setEnrollments((prev) =>
        prev.map((e) => {
          if (e.id !== enrollmentId) return e
          const done = new Set(e.completedResources ?? [])
          if (done.has(resourceId)) done.delete(resourceId)
          else done.add(resourceId)
          const progress = totalResources ? Math.round((done.size / totalResources) * 100) : 0
          return { ...e, completedResources: [...done], progress }
        }),
      ),
    submitAttempt: (input) => setAttempts((prev) => [...prev, { ...input, id: nextId('a'), submittedAt: today() }]),
    submitFeedback: (input) => setFeedback((prev) => [...prev, { ...input, id: nextId('f'), submittedAt: today() }]),
    submitContentFeedback: (input) =>
      setContentFeedback((prev) => [
        ...prev.filter((f) => !(f.resourceId === input.resourceId && f.traineeId === input.traineeId)),
        { ...input, id: nextId('cf'), submittedAt: today() },
      ]),

    createCourse: (input) => {
      const course: Course = { ...input, id: nextId('course'), resources: [], questionnaires: [], createdAt: today() }
      setCourses((prev) => [...prev, course])
      return course
    },
    assignTrainer: (courseId, trainerId) => updateCourse(courseId, (c) => ({ ...c, trainerId })),
    createQuestionnaire: (courseId, q) =>
      updateCourse(courseId, (c) => ({
        ...c,
        questionnaires: [...c.questionnaires, { ...q, id: nextId('q'), courseId, createdAt: today() }],
      })),
    uploadResource: (courseId, resource) =>
      updateCourse(courseId, (c) => ({
        ...c,
        resources: [...c.resources, { ...resource, id: nextId('r'), uploadedAt: today() }],
      })),

    publish: (item) => setPublished((prev) => [{ ...item, id: nextId('p'), date: today() }, ...prev]),
    unpublish: (id) => setPublished((prev) => prev.filter((p) => p.id !== id)),
    setCompetency: (entry) =>
      setCompetencyMap((prev) => {
        const rest = prev.filter((e) => !(e.trainerId === entry.trainerId && e.subject === entry.subject))
        return [...rest, entry]
      }),
  }

  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

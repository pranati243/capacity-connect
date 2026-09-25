export type Role = 'trainee' | 'trainer' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface Certificate {
  id: string
  name: string
  issuer: string
  year: string
}

export interface UserProfile {
  qualifications: string[]
  experience: string[]
  interests: string[]
  skills: string[]
  certificates: Certificate[]
  bio: string
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  avatarColor: string
  joinedAt: string
  profile: UserProfile
  passwordHash: string
  employeeId?: string
  department?: string
}

export interface ContentFeedback {
  id: string
  resourceId: string
  courseId: string
  traineeId: string
  helpful: boolean
  comment: string
  submittedAt: string
}

export interface Resource {
  id: string
  title: string
  type: 'lecture' | 'presentation' | 'material'
  uploadedAt: string
  sizeLabel: string
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export interface Questionnaire {
  id: string
  courseId: string
  title: string
  deadline: string
  questions: Question[]
  createdAt: string
}

export interface Course {
  id: string
  title: string
  subject: string
  description: string
  trainerId: string
  durationWeeks: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  resources: Resource[]
  questionnaires: Questionnaire[]
  createdAt: string
}

export interface Enrollment {
  id: string
  courseId: string
  traineeId: string
  enrolledAt: string
  progress: number
  completedResources?: string[]
}

export interface Attempt {
  id: string
  questionnaireId: string
  courseId: string
  traineeId: string
  score: number
  total: number
  submittedAt: string
  tabSwitches?: number
}

export interface Feedback {
  id: string
  courseId: string
  traineeId: string
  rating: number
  comment: string
  submittedAt: string
}

export type CompetencyLevel = 'novice' | 'proficient' | 'expert'

export interface CompetencyEntry {
  trainerId: string
  subject: string
  level: CompetencyLevel
  score: number
}

export type PublishType = 'notification' | 'announcement' | 'achievement' | 'content'

export interface PublishedItem {
  id: string
  type: PublishType
  title: string
  body: string
  date: string
}

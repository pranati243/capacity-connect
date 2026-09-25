import type {
  AppUser,
  Course,
  Enrollment,
  Attempt,
  Feedback,
  CompetencyEntry,
  PublishedItem,
  ContentFeedback,
} from '../types'

export const SUBJECTS = [
  'Meteorological Instruments',
  'Weather Forecasting Models',
  'Climate Data Analysis',
  'Disaster Risk Communication',
  'Satellite & Radar Systems',
  'Public Administration Ethics',
]

export const seedUsers: AppUser[] = [
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'admin@demo.gov.in',
    passwordHash: '845fb307af1d190ef40968b6c5b0d01119f7b4ad83b56237718f6b55bbe2175c',
    employeeId: 'MOES-00112',
    department: 'Training Division, MoES HQ, New Delhi',
    role: 'admin',
    status: 'approved',
    avatarColor: '#0A3D62',
    joinedAt: '2025-01-10',
    profile: {
      qualifications: ['M.Sc. Public Administration'],
      experience: ['Program Officer, MoES (6 yrs)'],
      interests: ['Governance', 'Training Policy'],
      skills: ['Program Management'],
      certificates: [],
      bio: 'Oversees training operations for the department.',
    },
  },
  {
    id: 'u-trainer-1',
    name: 'Dr. Anjali Rao',
    email: 'anjali.trainer@demo.gov.in',
    passwordHash: '9e58958c3827455804a0b3af17b99e2fe5ef94d9799722e44152697f9364f2f0',
    employeeId: 'IMD-10457',
    department: 'NWP Division, IMD New Delhi',
    role: 'trainer',
    status: 'approved',
    avatarColor: '#146C43',
    joinedAt: '2025-02-14',
    profile: {
      qualifications: ['Ph.D. Atmospheric Science', 'M.Sc. Meteorology'],
      experience: ['Senior Scientist, IMD (12 yrs)', 'Guest Faculty, IIT Delhi'],
      interests: ['Numerical Weather Prediction', 'Mentoring'],
      skills: ['Weather Forecasting Models', 'Climate Data Analysis'],
      certificates: [
        { id: 'c1', name: 'Advanced NWP Techniques', issuer: 'WMO', year: '2022' },
      ],
      bio: 'Specialist in forecasting models with a decade of field experience.',
    },
  },
  {
    id: 'u-trainer-2',
    name: 'Mr. Suresh Iyer',
    email: 'suresh.trainer@demo.gov.in',
    passwordHash: 'c0fe7a1f2ee946dc4395c3189e16456eaa36e29edba1a8d2d6348abd2ddffd33',
    employeeId: 'IMD-11820',
    department: 'Surface Instruments Division, IMD Pune',
    role: 'trainer',
    status: 'approved',
    avatarColor: '#8A4B08',
    joinedAt: '2025-03-02',
    profile: {
      qualifications: ['M.Tech. Electronics & Instrumentation'],
      experience: ['Technical Officer, IMD (9 yrs)'],
      interests: ['Radar Calibration', 'Field Training'],
      skills: ['Meteorological Instruments', 'Satellite & Radar Systems'],
      certificates: [
        { id: 'c2', name: 'Doppler Radar Systems', issuer: 'IMD Training Institute', year: '2021' },
      ],
      bio: 'Hands-on trainer for instrumentation and radar systems.',
    },
  },
  {
    id: 'u-trainee-1',
    name: 'Ritu Sharma',
    email: 'ritu.trainee@demo.gov.in',
    passwordHash: '780827937b4f6ccfa4bbe9b30672f2b0fedc53d4440d0a1cddefffadad0f85cf',
    employeeId: 'IMD-20431',
    department: 'Regional Met Centre, Chennai',
    role: 'trainee',
    status: 'approved',
    avatarColor: '#B33951',
    joinedAt: '2025-04-01',
    profile: {
      qualifications: ['B.Sc. Physics'],
      experience: ['Junior Assistant, Regional Met Centre (2 yrs)'],
      interests: ['Climate Science', 'Data Visualization'],
      skills: ['MS Excel', 'Basic Python'],
      certificates: [],
      bio: 'Aspiring meteorological analyst.',
    },
  },
  {
    id: 'u-trainee-2',
    name: 'Karan Mehta',
    email: 'karan.trainee@demo.gov.in',
    passwordHash: '0178abae04c7c36780135b19c6d36e6c1a6af6a5cb752fa6704ca56df903db0f',
    employeeId: 'IMD-20877',
    department: 'Met Centre, Bhopal',
    role: 'trainee',
    status: 'approved',
    avatarColor: '#5B4B8A',
    joinedAt: '2025-04-10',
    profile: {
      qualifications: ['B.Tech. Electronics'],
      experience: ['Field Observer, IMD (1 yr)'],
      interests: ['Instrumentation', 'Radar Systems'],
      skills: ['Hardware Troubleshooting'],
      certificates: [],
      bio: 'Field observer keen on instrumentation specialization.',
    },
  },
  {
    id: 'u-trainee-3',
    name: 'Priya Nair',
    email: 'priya.pending@demo.gov.in',
    passwordHash: 'a7ba7ca5bd054d62915ebf6c5c97ac79487caf830f3e04aa290dc7b29cf0ecad',
    employeeId: 'IMD-21340',
    department: 'Regional Met Centre, Kolkata',
    role: 'trainee',
    status: 'pending',
    avatarColor: '#2E86AB',
    joinedAt: '2026-09-20',
    profile: {
      qualifications: ['B.Sc. Environmental Science'],
      experience: [],
      interests: ['Disaster Management'],
      skills: [],
      certificates: [],
      bio: 'Newly signed up, awaiting admin approval.',
    },
  },
]

export const seedCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Fundamentals of Weather Forecasting Models',
    subject: 'Weather Forecasting Models',
    description:
      'Covers numerical weather prediction basics, model inputs, and interpreting forecast outputs for operational use.',
    trainerId: 'u-trainer-1',
    durationWeeks: 6,
    level: 'Intermediate',
    resources: [
      { id: 'r1', title: 'Week 1 - Intro to NWP (Lecture)', type: 'lecture', uploadedAt: '2025-05-01', sizeLabel: '210 MB' },
      { id: 'r2', title: 'Model Output Interpretation (Slides)', type: 'presentation', uploadedAt: '2025-05-08', sizeLabel: '4.2 MB' },
    ],
    questionnaires: [
      {
        id: 'q1',
        courseId: 'course-1',
        title: 'Module 1 Assessment: NWP Basics',
        deadline: '2026-10-05',
        createdAt: '2025-05-02',
        questions: [
          { id: 'q1-1', text: 'What does NWP stand for?', options: ['Numerical Weather Prediction', 'National Weather Portal', 'New Weather Protocol', 'Net Wind Pressure'], correctIndex: 0 },
          { id: 'q1-2', text: 'Which of these is a primary NWP input?', options: ['Stock prices', 'Atmospheric observations', 'Traffic data', 'Census data'], correctIndex: 1 },
          { id: 'q1-3', text: 'A forecast model grid resolution refers to:', options: ['Screen resolution', 'Spatial spacing between grid points', 'Number of users', 'File size'], correctIndex: 1 },
        ],
      },
    ],
    createdAt: '2025-04-20',
  },
  {
    id: 'course-2',
    title: 'Meteorological Instruments: Calibration & Maintenance',
    subject: 'Meteorological Instruments',
    description:
      'Hands-on training for calibrating and maintaining automatic weather stations and standard observatory instruments.',
    trainerId: 'u-trainer-2',
    durationWeeks: 4,
    level: 'Beginner',
    resources: [
      { id: 'r3', title: 'AWS Calibration Walkthrough (Lecture)', type: 'lecture', uploadedAt: '2025-05-10', sizeLabel: '340 MB' },
      { id: 'r4', title: 'Maintenance Checklist (Material)', type: 'material', uploadedAt: '2025-05-11', sizeLabel: '1.1 MB' },
    ],
    questionnaires: [
      {
        id: 'q2',
        courseId: 'course-2',
        title: 'Instrument Basics Quiz',
        deadline: '2026-10-08',
        createdAt: '2025-05-12',
        questions: [
          { id: 'q2-1', text: 'A barometer measures:', options: ['Wind speed', 'Atmospheric pressure', 'Humidity', 'Rainfall'], correctIndex: 1 },
          { id: 'q2-2', text: 'How often should AWS sensors be calibrated (typical)?', options: ['Never', 'Annually', 'Every 10 years', 'Hourly'], correctIndex: 1 },
        ],
      },
    ],
    createdAt: '2025-04-25',
  },
  {
    id: 'course-3',
    title: 'Satellite & Radar Systems Overview',
    subject: 'Satellite & Radar Systems',
    description: 'Introduction to Doppler weather radar and INSAT satellite imagery interpretation.',
    trainerId: 'u-trainer-2',
    durationWeeks: 5,
    level: 'Advanced',
    resources: [
      { id: 'r5', title: 'Doppler Radar Basics (Lecture)', type: 'lecture', uploadedAt: '2025-06-01', sizeLabel: '290 MB' },
    ],
    questionnaires: [],
    createdAt: '2025-05-20',
  },
  {
    id: 'course-4',
    title: 'Climate Data Analysis with Python',
    subject: 'Climate Data Analysis',
    description: 'Analyze historical climate datasets using Python, pandas, and basic statistical methods.',
    trainerId: 'u-trainer-1',
    durationWeeks: 8,
    level: 'Intermediate',
    resources: [
      { id: 'r6', title: 'Python Setup & Pandas Intro (Lecture)', type: 'lecture', uploadedAt: '2025-06-15', sizeLabel: '180 MB' },
      { id: 'r7', title: 'Sample Climate Dataset (Material)', type: 'material', uploadedAt: '2025-06-16', sizeLabel: '8.4 MB' },
    ],
    questionnaires: [],
    createdAt: '2025-06-10',
  },
]

export const seedEnrollments: Enrollment[] = [
  { id: 'e1', courseId: 'course-1', traineeId: 'u-trainee-1', enrolledAt: '2025-05-05', progress: 100, completedResources: ['r1', 'r2'] },
  { id: 'e2', courseId: 'course-2', traineeId: 'u-trainee-1', enrolledAt: '2025-05-15', progress: 50, completedResources: ['r3'] },
  { id: 'e3', courseId: 'course-2', traineeId: 'u-trainee-2', enrolledAt: '2025-05-14', progress: 100, completedResources: ['r3', 'r4'] },
  { id: 'e4', courseId: 'course-3', traineeId: 'u-trainee-2', enrolledAt: '2025-06-05', progress: 0, completedResources: [] },
]

export const seedAttempts: Attempt[] = [
  { id: 'a1', questionnaireId: 'q1', courseId: 'course-1', traineeId: 'u-trainee-1', score: 2, total: 3, submittedAt: '2025-06-01' },
  { id: 'a2', questionnaireId: 'q2', courseId: 'course-2', traineeId: 'u-trainee-2', score: 2, total: 2, submittedAt: '2025-06-02' },
]

export const seedFeedback: Feedback[] = [
  { id: 'f1', courseId: 'course-1', traineeId: 'u-trainee-1', rating: 4, comment: 'Very clear explanation of NWP concepts.', submittedAt: '2025-06-03' },
  { id: 'f2', courseId: 'course-2', traineeId: 'u-trainee-2', rating: 5, comment: 'Excellent hands-on demo, would recommend to peers.', submittedAt: '2025-06-04' },
]

export const seedCompetencyMap: CompetencyEntry[] = [
  { trainerId: 'u-trainer-1', subject: 'Weather Forecasting Models', level: 'expert', score: 92 },
  { trainerId: 'u-trainer-1', subject: 'Climate Data Analysis', level: 'proficient', score: 78 },
  { trainerId: 'u-trainer-1', subject: 'Disaster Risk Communication', level: 'novice', score: 45 },
  { trainerId: 'u-trainer-2', subject: 'Meteorological Instruments', level: 'expert', score: 95 },
  { trainerId: 'u-trainer-2', subject: 'Satellite & Radar Systems', level: 'proficient', score: 82 },
]

export const seedPublished: PublishedItem[] = [
  { id: 'p1', type: 'announcement', title: 'New batch for Climate Data Analysis opens Oct 1', body: 'Regional centre staff are encouraged to enroll before seats fill up.', date: '2026-09-20' },
  { id: 'p2', type: 'achievement', title: '120 employees certified this quarter', body: 'A record quarter for course completions across all zones.', date: '2026-09-18' },
  { id: 'p3', type: 'notification', title: 'Assessment deadline extended', body: 'Module 1 Assessment for NWP Basics now closes Oct 5.', date: '2026-09-15' },
  { id: 'p4', type: 'content', title: 'New material: AWS Maintenance Checklist', body: 'Uploaded by Mr. Suresh Iyer to the Meteorological Instruments course.', date: '2026-09-12' },
]

export const seedContentFeedback: ContentFeedback[] = [
  { id: 'cf1', resourceId: 'r1', courseId: 'course-1', traineeId: 'u-trainee-1', helpful: true, comment: 'Good intro, slides were easy to follow.', submittedAt: '2025-05-20' },
  { id: 'cf2', resourceId: 'r3', courseId: 'course-2', traineeId: 'u-trainee-2', helpful: true, comment: '', submittedAt: '2025-05-22' },
  { id: 'cf3', resourceId: 'r2', courseId: 'course-1', traineeId: 'u-trainee-1', helpful: false, comment: 'Needs more worked examples.', submittedAt: '2025-05-25' },
]

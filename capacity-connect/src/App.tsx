import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import { PrefsProvider } from './context/PrefsContext'
import { PortalLayout } from './components/layout/PortalLayout'
import { Home } from './pages/public/Home'
import { Login } from './pages/public/Login'
import { Signup } from './pages/public/Signup'
import { VerifyCertificate } from './pages/public/VerifyCertificate'
import { Help } from './pages/public/Help'
import { Sitemap } from './pages/public/Sitemap'
import { ProfilePage } from './pages/shared/ProfilePage'
import { TraineeDashboard } from './pages/trainee/TraineeDashboard'
import { Courses } from './pages/trainee/Courses'
import { CourseDetail } from './pages/trainee/CourseDetail'
import { Assessment } from './pages/trainee/Assessment'
import { TraineeAssessments } from './pages/trainee/TraineeAssessments'
import { TraineeLibrary } from './pages/trainee/TraineeLibrary'
import { Certificates } from './pages/trainee/Certificates'
import { TrainerDashboard } from './pages/trainer/TrainerDashboard'
import { Questionnaires } from './pages/trainer/Questionnaires'
import { Performance } from './pages/trainer/Performance'
import { Library } from './pages/trainer/Library'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { Approvals } from './pages/admin/Approvals'
import { AdminCourses } from './pages/admin/AdminCourses'
import { CompetencyMap } from './pages/admin/CompetencyMap'
import { Publish } from './pages/admin/Publish'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <PrefsProvider>
      <AppDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/verify/:certId" element={<VerifyCertificate />} />
            <Route path="/help" element={<Help />} />
            <Route path="/sitemap" element={<Sitemap />} />

            <Route path="/trainee" element={<PortalLayout role="trainee" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TraineeDashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="library" element={<TraineeLibrary />} />
              <Route path="assessments" element={<TraineeAssessments />} />
              <Route path="assessment/:courseId/:questionnaireId" element={<Assessment />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="/trainer" element={<PortalLayout role="trainer" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TrainerDashboard />} />
              <Route path="questionnaires" element={<Questionnaires />} />
              <Route path="performance" element={<Performance />} />
              <Route path="library" element={<Library />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="/admin" element={<PortalLayout role="admin" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="competency-map" element={<CompetencyMap />} />
              <Route path="publish" element={<Publish />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </PrefsProvider>
  )
}

import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { QueueProvider } from './context/QueueProvider'
import { ToastProvider } from './context/ToastContext'
import { DoctorLayout } from './components/layout/DoctorLayout'
import { ClientLayout } from './components/layout/ClientLayout'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LiveQueuePage } from './pages/LiveQueuePage'
import { DashboardPage } from './pages/doctor/DashboardPage'
import { QueuePage } from './pages/doctor/QueuePage'
import { PatientsPage } from './pages/doctor/PatientsPage'
import { EmergencyPage } from './pages/doctor/EmergencyPage'
import { WorkloadPage } from './pages/doctor/WorkloadPage'
import { AnalyticsPage } from './pages/doctor/AnalyticsPage'
import { SettingsPage } from './pages/doctor/SettingsPage'
import { MyQueuePage } from './pages/client/MyQueuePage'
import { AppointmentPage } from './pages/client/AppointmentPage'
import { NotificationsPage } from './pages/client/NotificationsPage'
import { HistoryPage } from './pages/client/HistoryPage'
import { ProfilePage } from './pages/client/ProfilePage'

function RequireRole({ role }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return <Outlet />
}
function RootRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueueProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/display" element={<LiveQueuePage />} />
              <Route element={<RequireRole role="doctor" />}>
                <Route path="/doctor" element={<DoctorLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="queue" element={<QueuePage />} />
                  <Route path="patients" element={<PatientsPage />} />
                  <Route path="emergency" element={<EmergencyPage />} />
                  <Route path="workload" element={<WorkloadPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route element={<RequireRole role="client" />}>
                <Route path="/client" element={<ClientLayout />}>
                  <Route index element={<MyQueuePage />} />
                  <Route path="appointment" element={<AppointmentPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </QueueProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

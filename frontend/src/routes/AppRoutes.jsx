import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import NotFoundPage from "../pages/auth/NotFoundPage";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import DoctorListPage from "../pages/patient/DoctorListPage";
import DoctorDetailsPage from "../pages/patient/DoctorDetailsPage";
import BookAppointmentPage from "../pages/patient/BookAppointmentPage";
import MyAppointmentsPage from "../pages/patient/MyAppointmentsPage";
import StatsDashboard from "../pages/admin/StatsDashboard";
import UsersManagementPage from "../pages/admin/UsersManagementPage";
import AllAppointmentsPage from "../pages/admin/AllAppointmentsPage";
import AdminSpecialtyPage from "../pages/admin/AdminSpecialtyPage";
import AdminDoctorApprovals from "../pages/admin/AdminDoctorApprovals";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ScheduleManagementPage from "../pages/doctor/ScheduleManagementPage";
import DoctorAppointmentsPage from "../pages/doctor/DoctorAppointmentsPage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";
import { ROLES } from "../constants/roles";
import PatientHome from "../pages/patient/PatientHome";
import PatientProfilePage from "../pages/patient/PatientProfilePage";
import NotificationsPage from "../pages/common/NotificationsPage";
import SettingsPage from "../pages/common/SettingsPage";
import ChatPage from "../pages/common/ChatPage";
import MainLayout from "../components/layout/MainLayout";

import DoctorOnboardingPage from "../pages/doctor/DoctorOnboardingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootRedirect />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/doctors" element={<DoctorListPage />} />
          <Route path="/patient/doctors/:id" element={<DoctorDetailsPage />} />
          <Route path="/patient/book/:doctorId" element={<BookAppointmentPage />} />
          <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
          <Route path="/patient/chat" element={<ChatPage />} />
          <Route path="/patient/profile" element={<PatientProfilePage />} />
        </Route>

        {/* Onboarding Route (Doctors only) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
          <Route path="/doctor/onboarding" element={<DoctorOnboardingPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
          <Route element={<DoctorOnboardingGuard />}>
            <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/schedule" element={<ScheduleManagementPage />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/chat" element={<ChatPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<StatsDashboard />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/users" element={<UsersManagementPage />} />
          <Route path="/admin/doctor-approvals" element={<AdminDoctorApprovals />} />
          <Route path="/admin/specialties" element={<AdminSpecialtyPage />} />
          <Route path="/admin/appointments" element={<AllAppointmentsPage />} />
        </Route>

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

// Guard to force doctor onboarding
const DoctorOnboardingGuard = () => {
  const { user } = useSelector((state) => state.auth);
  if (user?.role === 'doctor' && !user?.profileComplete) {
    return <Navigate to="/doctor/onboarding" replace />;
  }
  return <Outlet />;
};

const RootRedirect = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role?.toLowerCase();
    
    if (role === ROLES.DOCTOR.toLowerCase() && !user?.profileComplete) {
      return <Navigate to="/doctor/onboarding" replace />;
    }
    
    if (role === ROLES.ADMIN.toLowerCase()) return <Navigate to="/admin" replace />;
    if (role === ROLES.DOCTOR.toLowerCase()) return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/patient" replace />;
};

export default AppRoutes;

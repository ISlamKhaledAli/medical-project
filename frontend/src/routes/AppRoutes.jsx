import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
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
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ScheduleManagementPage from "../pages/doctor/ScheduleManagementPage";
import MainLayout from "../components/layout/MainLayout";

// Placeholders for other components
const Dashboard = () => <Navigate to="/doctors" replace />;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        
        {/* Utility Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Protected Routes wrapped in MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout>
                <Outlet />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          {/* Patient Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
          <Route path="/book/:doctorId" element={<BookAppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<StatsDashboard />} />
            <Route path="/admin/users" element={<UsersManagementPage />} />
            <Route path="/admin/appointments" element={<AllAppointmentsPage />} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/schedule" element={<ScheduleManagementPage />} />
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

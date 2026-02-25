import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../constants/roles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken, isInitialLoading } = useSelector((state) => state.auth);
  
  console.log("Token:", accessToken);
  console.log("User:", user);

  if (isInitialLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Enforce approval status for doctors
  if (user.role === ROLES.DOCTOR && user.status !== "approved") {
    console.warn("Doctor account not approved. Redirecting to unauthorized.");
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
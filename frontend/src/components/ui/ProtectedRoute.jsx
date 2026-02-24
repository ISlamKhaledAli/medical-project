import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../constants/roles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken, isInitialLoading } = useSelector((state) => state.auth);

  if (isInitialLoading) {
    return null;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
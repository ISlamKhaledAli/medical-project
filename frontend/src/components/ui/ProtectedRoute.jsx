import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../constants/roles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthChecking } = useSelector((state) => state.auth);

  if (isAuthChecking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === ROLES.DOCTOR && user.status !== "approved") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
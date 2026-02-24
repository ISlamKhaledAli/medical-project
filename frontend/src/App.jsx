import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, stopInitialLoading } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import GlobalLoader from "./components/ui/GlobalLoader";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // Verify it's a real token, not a stringified "null" or "undefined"
    if (token && token !== "null" && token !== "undefined" && token.length > 10) {
      dispatch(getMe());
    } else {
      dispatch(stopInitialLoading());
      // Clean up if it was a malformed token
      if (token) localStorage.removeItem("accessToken");
    }
  }, [dispatch]);

  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  );
}

export default App;
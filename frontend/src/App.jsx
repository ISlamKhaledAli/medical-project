import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, stopInitialLoading } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import GlobalLoader from "./components/ui/GlobalLoader";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(getMe());
    } else {
      dispatch(stopInitialLoading());
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
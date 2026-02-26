import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { fetchConversations } from "../../features/chat/chatSlice";
import { clearGlobalSearchQuery } from "../../features/ui/uiSlice";

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Standardized check
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false);
    const location = useLocation();
    
    const { user, accessToken, isAuthChecking } = useSelector((state) => state.auth);

    // Routes where search bar should be shown
    const searchRoutes = [
        '/patient/doctors',
        '/admin/users',
        '/admin/doctor-approvals',
        '/admin/specialties',
        '/admin/appointments'
    ];
    
    // Check if current route should show search bar
    const showSearch = searchRoutes.some(route => 
        location.pathname === route || location.pathname.startsWith(route.split(':')[0])
    );

    // Clear global search when navigating to pages without search
    useEffect(() => {
        if (!showSearch) {
            dispatch(clearGlobalSearchQuery());
        }
    }, [location.pathname, showSearch, dispatch]);

    useEffect(() => {
        if (accessToken) {
            dispatch(fetchConversations());
        }
    }, [dispatch, accessToken]);
    const navigate = useNavigate();

    // Protection logic is handled by the wrapping ProtectedRoute component

    const toggleDrawer = () => {
        setOpen(!open);
    };

    if (isAuthChecking) return null; // Or a full-screen skeleton/loader

    return (
        <Box sx={{ display: "flex", bgcolor: "#f1f5f9", minHeight: "100vh" }}>
            <Sidebar 
                open={open} 
                toggleDrawer={toggleDrawer} 
                isMobile={isMdDown} 
            />
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { md: `calc(100% - 130px)` }, // 100px sidebar + some margin
                    ml: { md: "110px" }, // Offset for the fixed sidebar
                    transition: "0.3s"
                }}
            >
                <Navbar onMenuClick={toggleDrawer} showSearch={showSearch} />
                
                <Box sx={{ mt: 2 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;

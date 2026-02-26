import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Standardized check
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false);
    
    const { user, accessToken, isAuthChecking } = useSelector((state) => state.auth);
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
                <Navbar onMenuClick={toggleDrawer} />
                
                <Box sx={{ mt: 2 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { fetchConversations } from "../../features/chat/chatSlice";

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false);
    
    const { accessToken, isAuthChecking } = useSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken) {
            dispatch(fetchConversations());
        }
    }, [dispatch, accessToken]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    if (isAuthChecking) return null;

    return (
        <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
            <Sidebar 
                open={open} 
                toggleDrawer={toggleDrawer} 
                isMobile={isMdDown} 
            />
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    width: { md: `calc(100% - 130px)` }, 
                    ml: { md: "100px" },
                    transition: "all 0.3s ease"
                }}
            >
                <Navbar onMenuClick={toggleDrawer} />
                
                <Box 
                    sx={{ 
                        p: { xs: 2.5, sm: 4, md: 5 }, 
                        flexGrow: 1,
                        maxWidth: "1600px",
                        width: "100%",
                        mx: "auto"
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;


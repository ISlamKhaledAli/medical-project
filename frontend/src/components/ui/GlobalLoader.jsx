import { useSelector } from "react-redux";
import { Backdrop, CircularProgress, Typography, Box, alpha } from "@mui/material";

const GlobalLoader = () => {
    const { globalLoading } = useSelector((state) => state.ui);
    const { isAuthChecking } = useSelector((state) => state.auth);

    // Initial auth check always takes priority visual precedence
    const open = isAuthChecking || globalLoading;

    if (!open) return null;

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 2000,
                flexDirection: "column",
                gap: 3,
                backgroundColor: alpha("#1A237E", 0.8), // Deep indigo overlay
                backdropFilter: "blur(8px)",
                transition: "all 0.4s ease"
            }}
            open={open}
        >
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress 
                color="inherit" 
                size={70} 
                thickness={4} 
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" component="div" color="inherit" sx={{ fontWeight: 800 }}>
                  MT
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", mb: 1 }}>
                    {isAuthChecking ? "Authenticating" : "Loading"}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 500 }}>
                    Please wait while we prepare your session...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;


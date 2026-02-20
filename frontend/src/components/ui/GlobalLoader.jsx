import { useSelector } from "react-redux";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const GlobalLoader = () => {
    const { globalLoading } = useSelector((state) => state.ui);
    const { isInitialLoading } = useSelector((state) => state.auth);

    // Initial auth check always takes priority visual precedence
    const open = isInitialLoading || globalLoading;

    if (!open) return null;

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: "column",
                gap: 2,
                backgroundColor: "rgba(26, 35, 126, 0.7)", // Deep blue overlay
                backdropFilter: "blur(4px)",
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} thickness={4} />
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    {isInitialLoading ? "AUTHENTICATING" : "LOADING"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 1 }}>
                    Please wait a moment...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;

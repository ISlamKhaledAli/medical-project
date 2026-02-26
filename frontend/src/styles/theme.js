import { createTheme, alpha } from "@mui/material/styles";

// Professional Medical Color Palette
const COLORS = {
    primary: "#1565C0", // Medical Blue
    secondary: "#00897B", // Teal
    success: "#2E7D32",
    warning: "#ED6C02",
    error: "#D32F2F",
    info: "#0288D1",
    background: "#F5F7FA",
    text: {
        primary: "#1A237E", // Deep Indigo for contrast
        secondary: "#546E7A",
    },
};

const theme = createTheme({
    palette: {
        primary: {
            main: COLORS.primary,
            light: alpha(COLORS.primary, 0.08),
            dark: "#0D47A1",
        },
        secondary: {
            main: COLORS.secondary,
            light: alpha(COLORS.secondary, 0.08),
            dark: "#00695C",
        },
        background: {
            default: COLORS.background,
            paper: "#FFFFFF",
        },
        text: COLORS.text,
        success: {
            main: COLORS.success,
            light: alpha(COLORS.success, 0.08),
        },
        warning: {
            main: COLORS.warning,
            light: alpha(COLORS.warning, 0.08),
        },
        error: {
            main: COLORS.error,
            light: alpha(COLORS.error, 0.08),
        },
        info: {
            main: COLORS.info,
            light: alpha(COLORS.info, 0.08),
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 900, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.01em" },
        h3: { fontWeight: 800, letterSpacing: "-0.01em" },
        h4: { fontWeight: 800, letterSpacing: "-0.01em" },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { fontSize: "1rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        button: {
            fontWeight: 700,
            textTransform: "none",
        },
    },
    shadows: [
        "none",
        "0px 2px 4px rgba(0,0,0,0.02)",
        "0px 4px 8px rgba(0,0,0,0.04)",
        "0px 8px 16px rgba(0,0,0,0.06)",
        "0px 12px 24px rgba(0,0,0,0.08)",
        "0px 16px 32px rgba(0,0,0,0.10)",
        "0px 20px 40px rgba(0,0,0,0.12)",
        ...Array(18).fill("none"), // Fill remaining slots with none
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "8px 20px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(21, 101, 192, 0.2)",
                    },
                },
                contained: {
                    boxShadow: "0 4px 12px rgba(21, 101, 192, 0.15)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 8px 16px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: 16,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
                rounded: {
                    borderRadius: 12,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 800,
                    backgroundColor: alpha("#F5F7FA", 0.5),
                    color: "#546E7A",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                },
                root: {
                    padding: "16px",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: COLORS.primary,
                        },
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F8FAFC",
                },
            },
        },
    },
});

export default theme;

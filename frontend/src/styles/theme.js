import { createTheme, alpha } from "@mui/material/styles";

// Professional Medical Color Palette System
const COLORS = {
    primary: "#1565C0", // Medical Blue
    secondary: "#00897B", // Teal
    success: "#2E7D32",
    warning: "#ED6C02",
    error: "#D32F2F",
    info: "#0288D1",
    light: {
        background: "#F5F7FA",
        paper: "#FFFFFF",
        textPrimary: "#1A237E",
        textSecondary: "#546E7A",
    },
    dark: {
        background: "#121212", // Professional Neutral Dark
        paper: "#1E1E1E", // Surface Level 1
        elevated: "#242424", // Surface Level 2
        textPrimary: "rgba(255, 255, 255, 0.87)",
        textSecondary: "rgba(255, 255, 255, 0.6)",
        disabled: "rgba(255, 255, 255, 0.38)",
    }
};

export const getAppTheme = (mode) => {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? "#42A5F5" : COLORS.primary,
                light: alpha(COLORS.primary, 0.08),
                dark: isDark ? "#90CAF9" : "#0D47A1",
            },
            secondary: {
                main: COLORS.secondary,
                light: alpha(COLORS.secondary, 0.08),
                dark: "#00695C",
            },
            background: {
                default: isDark ? COLORS.dark.background : COLORS.light.background,
                paper: isDark ? COLORS.dark.paper : COLORS.light.paper,
            },
            text: {
                primary: isDark ? COLORS.dark.textPrimary : COLORS.light.textPrimary,
                secondary: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
                disabled: isDark ? COLORS.dark.disabled : "rgba(0, 0, 0, 0.38)",
            },
            divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
            action: {
                hover: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                selected: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                disabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
            },
            success: { main: COLORS.success },
            warning: { main: COLORS.warning },
            error: { main: COLORS.error },
            info: { main: COLORS.info },
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
            button: { fontWeight: 700, textTransform: "none" },
        },
        shadows: isDark ? [
            "none",
            "0px 2px 4px rgba(0,0,0,0.4)",
            "0px 4px 8px rgba(0,0,0,0.45)",
            "0px 8px 16px rgba(0,0,0,0.5)",
            ...Array(21).fill("none"),
        ] : [
            "none",
            "0px 2px 4px rgba(0,0,0,0.02)",
            "0px 4px 8px rgba(0,0,0,0.04)",
            "0px 8px 16px rgba(0,0,0,0.06)",
            ...Array(21).fill("none"),
        ],
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition: "background-color 0.2s ease, color 0.2s ease",
                        scrollbarColor: isDark ? "#444 #121212" : "#ccc #f5f5f5",
                        "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                        "&::-webkit-scrollbar-track": { backgroundColor: isDark ? "#121212" : "#f5f5f5" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: isDark ? "#444" : "#ccc", borderRadius: "10px" },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 10, padding: "8px 20px" },
                    containedPrimary: {
                        boxShadow: isDark ? "none" : "0 4px 12px rgba(21, 101, 192, 0.2)",
                    }
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        borderRadius: 16,
                        backgroundColor: isDark ? COLORS.dark.paper : COLORS.light.paper,
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0,0,0,0.05)",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none" },
                    rounded: { borderRadius: 12 },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 800,
                        backgroundColor: isDark ? alpha(COLORS.dark.elevated, 0.8) : alpha(COLORS.light.background, 0.8),
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "#546E7A",
                    },
                },
            },
            MuiTextField: {
                defaultProps: { variant: "outlined", size: "small" },
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 10,
                            backgroundColor: isDark ? alpha(COLORS.dark.background, 0.5) : "#FFFFFF",
                            "& fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.15)" },
                            "&:hover fieldset": { borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0,0,0,0.25)" },
                        },
                    },
                },
            },
        },
    });
};

const defaultTheme = getAppTheme("light");
export default defaultTheme;

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "../../styles/theme";

/**
 * ThemeWrapper component that selects the current mode (light/dark)
 * from the Redux store and provides the corresponding MUI theme.
 */
const ThemeWrapper = ({ children }) => {
    const { mode } = useSelector((state) => state.ui);

    // Memoize the theme object so it only regenerates when mode changes
    const theme = useMemo(() => getAppTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default ThemeWrapper;

/**
 * Debug Trace Utility
 * Provides a standardized way to log events with specific categories.
 * Allows toggling logs based on category or environment.
 */

const DEBUG_KEY = "medi_connect_debug";

const getDebugConfig = () => {
    try {
        const config = localStorage.getItem(DEBUG_KEY);
        return config ? JSON.parse(config) : { enabled: true, categories: ["auth", "api", "admin"] };
    } catch {
        return { enabled: false, categories: [] };
    }
};

const trace = (category, message, data = null) => {
    const config = getDebugConfig();

    if (!config.enabled && process.env.NODE_ENV !== "development") return;
    if (config.categories.length > 0 && !config.categories.includes(category)) return;

    const timestamp = new Date().toISOString().split("T")[1].split("Z")[0];
    const styles = {
        auth: "color: #ff9800; font-weight: bold;",
        api: "color: #2196f3; font-weight: bold;",
        admin: "color: #f44336; font-weight: bold;",
        ui: "color: #9c27b0; font-weight: bold;",
        default: "color: #757575; font-weight: bold;"
    };

    const style = styles[category] || styles.default;

    console.groupCollapsed(`%c[${category.toUpperCase()}] %c${timestamp} - ${message}`, style, "color: inherit; font-weight: normal;");
    if (data) {
        console.log("Details:", data);
    }
    console.trace("Stack Trace");
    console.groupEnd();
};

export const debugAuth = (msg, data) => trace("auth", msg, data);
export const debugAPI = (msg, data) => trace("api", msg, data);
export const debugAdmin = (msg, data) => trace("admin", msg, data);
export const debugUI = (msg, data) => trace("ui", msg, data);

export default trace;

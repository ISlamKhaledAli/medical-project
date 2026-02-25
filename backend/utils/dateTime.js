/**
 * Convert HH:MM time string to total minutes from the start of the day.
 * @param {string} time - Time in HH:MM format.
 * @returns {number} - Total minutes.
 */
export const timeToMinutes = (time) => {
    if (!time || typeof time !== "string" || !time.includes(":")) {
        console.error("Invalid time format passed to timeToMinutes:", time);
        return 0; // Guard against undefined or malformed strings
    }
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

/**
 * Safely parses a "YYYY-MM-DD" string into a local Date object.
 * Avoids UTC shifts from new Date(string).
 * @param {string} dateStr 
 * @returns {Date}
 */
export const parseDateString = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-")) {
        return new Date();
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    // month is 0-indexed in Date constructor
    return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Normalizes a date to the start of the day (00:00:00.000).
 * @param {Date|string} date - Date to normalize.
 * @returns {Date} - Normalized date object.
 */
export const normalizeDate = (date) => {
    const d = typeof date === "string" ? parseDateString(date) : new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

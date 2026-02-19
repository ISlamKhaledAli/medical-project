/**
 * Convert HH:MM time string to total minutes from the start of the day.
 * @param {string} time - Time in HH:MM format.
 * @returns {number} - Total minutes.
 */
export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

/**
 * Normalizes a date to the start of the day (00:00:00.000).
 * @param {Date|string} date - Date to normalize.
 * @returns {Date} - Normalized date object.
 */
export const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

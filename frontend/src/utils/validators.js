/**
 * Utility functions for form validation
 */

/**
 * Validates email format
 * @param {string} email 
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Please enter a valid email address";
    return null;
};

/**
 * Validates name format (Min 3 chars, letters and spaces only)
 * @param {string} name 
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters long";
    const re = /^[a-zA-Z\s]+$/;
    if (!re.test(name)) return "Name can only contain letters and spaces";
    return null;
};

/**
 * Validates password strength
 * @param {string} password 
 * @returns {object} { error: string|null, strength: number }
 */
export const validatePassword = (password) => {
    if (!password) return { error: "Password is required", strength: 0 };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (password.length < 8) return { error: "Password must be at least 8 characters", strength };
    if (!/[a-z]/.test(password)) return { error: "Must include at least one lowercase letter", strength };
    if (!/[A-Z]/.test(password)) return { error: "Must include at least one uppercase letter", strength };
    if (!/[0-9]/.test(password)) return { error: "Must include at least one number", strength };
    if (!/[^A-Za-z0-9]/.test(password)) return { error: "Must include at least one special character", strength };

    return { error: null, strength };
};

/**
 * Returns a human-readable label for password strength
 * @param {number} strength - 0 to 5
 * @returns {string}
 */
export const getStrengthLabel = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
};

/**
 * Returns a MUI color name based on password strength
 * @param {number} strength - 0 to 5
 * @returns {string} "error" | "warning" | "success"
 */
export const getStrengthColor = (strength) => {
    if (strength < 2) return "error";
    if (strength < 4) return "warning";
    return "success";
};

/**
 * Normalizes email (lowercase and trim)
 * @param {string} email 
 * @returns {string}
 */
export const normalizeEmail = (email) => email.toLowerCase().trim();

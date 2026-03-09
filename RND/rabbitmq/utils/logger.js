export const logger = {
    info: (msg, data = {}) => console.log(`[INFO] ${msg}`, data),
    error: (msg, error) => console.error(`[ERROR] ${msg}`, error.message),
    success: (msg, data = {}) => console.log(`[SUCCESS] ${msg}`, data)
};

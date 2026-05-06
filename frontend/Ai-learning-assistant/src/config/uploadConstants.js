// Upload configuration constants - mirrors backend config/uploadConstants.js
// These values should match the backend MAX_FILE_SIZE from .env

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 10485760, // 10MB - matches backend .env MAX_FILE_SIZE
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ['application/pdf'],
  ALLOWED_FILE_EXTENSIONS: ['.pdf'],
};

export const getFileSizeInMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

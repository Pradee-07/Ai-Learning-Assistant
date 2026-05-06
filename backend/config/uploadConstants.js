// Upload configuration constants
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ['application/pdf'],
  ALLOWED_FILE_EXTENSIONS: ['.pdf'],
};

export const getFileSizeInMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

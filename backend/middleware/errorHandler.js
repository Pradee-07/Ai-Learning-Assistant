import { UPLOAD_LIMITS } from '../config/uploadConstants.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let isProduction = process.env.NODE_ENV === 'production';

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key (Error code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = `File size exceeds the maximum limit of ${UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    message = 'Access denied';
    statusCode = 403;
  }

  // Log error for developer (with details in development only)
  if (isProduction) {
    // Log to file/external service in production
    console.error(`[${new Date().toISOString()}] Error:`, {
      statusCode,
      message,
      endpoint: `${req.method} ${req.path}`,
      userId: req.user?._id || 'anonymous'
    });
  } else {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      endpoint: `${req.method} ${req.path}`
    });
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler; 
// 🔒 Security: Middleware to catch requests for non-existent routes.
// This prevents the default Express 404 HTML page from being sent,
// which could leak information about the server framework.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// 🔒 Security: A global error handler to catch all errors from async routes.
// It ensures that no sensitive error details or stack traces are sent to the client
// in a production environment, sending a generic message instead.
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // 🔒 Security: Only show the stack trace in development for debugging purposes.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
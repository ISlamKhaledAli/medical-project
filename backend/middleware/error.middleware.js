const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `An account with that ${field} already exists.`;
    error.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.message = message;
    error.statusCode = 400;
  }

  if (err.name === "CastError") {
    error.message = `Resource not found. Invalid ID format: ${err.value}`;
    error.statusCode = 404;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token. Please log in again.";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Your token has expired. Please log in again.";
    error.statusCode = 401;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { globalErrorHandler };

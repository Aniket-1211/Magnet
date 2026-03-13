export function errorMiddleware(err, _req, res, _next) {
  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors || {})
      .map((error) => error.message)
      .filter(Boolean);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed"
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

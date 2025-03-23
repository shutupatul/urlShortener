function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Something went wrong!",
    status: statusCode,
  });
}

module.exports = errorHandler;

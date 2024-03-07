const globalErrorHandler = (req, res, next, err) => {
  res.status(500).json({
    status: 'fail',
    message: err.message,
    error: err.stack
  });
};

module.exports = globalErrorHandler
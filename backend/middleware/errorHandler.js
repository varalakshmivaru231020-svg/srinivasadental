const { MAX_MB } = require('./upload');

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Resource not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isDbDown = ['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'PROTOCOL_CONNECTION_LOST'].includes(err.code);

  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? `Image must be smaller than ${MAX_MB} MB.` : 'Could not upload that file.';
    return res.status(400).json({ success: false, message });
  }

  const status = isDbDown ? 503 : err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} —`, err.code || '', err.message);
  }

  let message = 'Something went wrong. Please try again or call the clinic.';
  if (isDbDown) message = 'Our booking system is temporarily unavailable. Please call 9611146955 / 9845195605.';
  else if (status === 413) message = 'The submitted data is too large.';
  else if (status === 400) message = 'Invalid request.';

  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && status >= 500 && { detail: err.message }),
  });
}

module.exports = { notFound, errorHandler };

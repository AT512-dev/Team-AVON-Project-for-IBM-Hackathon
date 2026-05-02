'use strict';

function errorHandler(err, _req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error('[CodeGuard Error]', err);

  res.status(err.status ?? 500).json({
    success: false,
    error:   err.message ?? 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = { errorHandler };

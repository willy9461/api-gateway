const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  max: 100,                  // máximo 100 requests por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.',
  },
});

module.exports = limiter;
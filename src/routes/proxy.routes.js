const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services.config');

function setupRoutes(app) {
  Object.values(services).forEach((service) => {
    const proxy = createProxyMiddleware({
      target: service.url,
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          if (res.headersSent) return;
          res.status(502).json({
            error: 'Servicio no disponible',
            detalle: `No se pudo conectar a ${service.url}`,
          });
        },
      },
    });

    app.all(service.prefix, (req, res, next) => proxy(req, res, next));
    app.all(`${service.prefix}/*path`, (req, res, next) => proxy(req, res, next));
  });
}

module.exports = setupRoutes;
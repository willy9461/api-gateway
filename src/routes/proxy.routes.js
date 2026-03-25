const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services.config');

function setupRoutes(app) {
  Object.values(services).forEach((service) => {
    app.use(
      service.prefix,
      createProxyMiddleware({
        target: service.url,
        changeOrigin: true,
        on: {
          error: (err, req, res) => {
            res.status(502).json({
              error: 'Servicio no disponible',
              servicio: service.url,
            });
          },
        },
      })
    );
  });
}

module.exports = setupRoutes;

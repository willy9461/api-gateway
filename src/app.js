require('dotenv').config();
const express = require('express');
const loggerMiddleware = require('./middleware/logger.middleware');
const rateLimiter = require('./middleware/rateLimiter.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const setupRoutes = require('./routes/proxy.routes');
const services = require('./config/services.config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(loggerMiddleware);
app.use(rateLimiter);
app.use(express.json());
app.use(authMiddleware);

app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled(
    Object.entries(services).map(async ([name, service]) => {
      const response = await fetch(`${service.url}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return { name, status: response.ok ? 'ok' : 'degraded' };
    })
  );

  const result = { gateway: 'ok' };
  checks.forEach((check) => {
    if (check.status === 'fulfilled') {
      result[check.value.name] = check.value.status;
    } else {
      result[check.reason?.cause?.name || 'servicio'] = 'unreachable';
    }
  });

  res.json(result);
});

setupRoutes(app);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

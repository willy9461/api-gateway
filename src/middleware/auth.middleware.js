const jwt = require('jsonwebtoken');

const PUBLIC_ROUTES = [
  { path: '/api/auth/login', method: 'POST' },
  { path: '/api/auth/registro', method: 'POST' },
  { path: '/health', method: 'GET' },
];

function isPublicRoute(req) {
  return PUBLIC_ROUTES.some(
    (route) => route.path === req.path && route.method === req.method
  );
}

function authMiddleware(req, res, next) {
  if (isPublicRoute(req)) return next();

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // lo inyectamos para que los servicios lo usen
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
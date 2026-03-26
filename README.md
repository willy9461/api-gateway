# API Gateway

Punto de entrada único para el sistema de microservicios. Implementa autenticación JWT, rate limiting y proxy inverso hacia los servicios internos.

## Arquitectura
```
Cliente → API Gateway :3000
              ├── Auth Service      :3001
              ├── Recursos Service  :3002
              └── Notif Service     :3003
```

## Funcionalidades

- Verificación de JWT sin llamar al Auth Service (validación local)
- Rate limiting: 100 requests por IP cada 15 minutos
- Proxy inverso hacia los microservicios internos
- Health check con estado de cada servicio
- Logging de todas las requests con método, ruta, status y tiempo de respuesta

## Requisitos

- Docker y Docker Compose

## Levantar el sistema
```bash
git clone https://github.com/willy9461/auth-service.git
cd api-gateway
cp .env.example .env
docker compose up --build
```

El sistema queda disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /health | No | Estado de todos los servicios |
| POST | /api/auth/login | No | Iniciar sesión |
| POST | /api/auth/registro | No | Registrar usuario |
| * | /api/recursos/* | JWT | CRUD de recursos |
| * | /api/notificaciones/* | JWT | Gestión de notificaciones |

## Ejemplos de uso
```bash
# Health check
curl http://localhost:3000/health

# Request sin token (401)
curl http://localhost:3000/api/recursos

# Request con token válido
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/recursos
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del gateway (default: 3000) |
| JWT_SECRET | Secreto para verificar tokens JWT |
| AUTH_SERVICE_URL | URL del servicio de autenticación |
| RECURSOS_SERVICE_URL | URL del servicio de recursos |
| NOTIF_SERVICE_URL | URL del servicio de notificaciones |

## Stack

- Node.js 22
- Express 5
- http-proxy-middleware 3
- jsonwebtoken
- Docker + Docker Compose

## Estructura del proyecto
```
src/
├── middleware/
│   ├── auth.middleware.js        # Verificación JWT
│   ├── rateLimiter.middleware.js # Límite de requests por IP
│   └── logger.middleware.js      # Logging de requests
├── routes/
│   └── proxy.routes.js           # Ruteo hacia microservicios
├── config/
│   └── services.config.js        # URLs de servicios internos
└── app.js                        # Entry point
```

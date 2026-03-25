require('dotenv').config();

const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL,
    prefix: '/api/auth',
  },
  recursos: {
    url: process.env.RECURSOS_SERVICE_URL,
    prefix: '/api/recursos',
  },
  notificaciones: {
    url: process.env.NOTIF_SERVICE_URL,
    prefix: '/api/notificaciones',
  },
};

module.exports = services;
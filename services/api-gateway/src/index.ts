import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde.' },
});
app.use(limiter);

// Target Microservice URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
const CART_SERVICE = process.env.CART_SERVICE_URL || 'http://localhost:3005';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';
const HEALTH_SERVICE = process.env.HEALTH_SERVICE_URL || 'http://localhost:3007';
const SYNC_SERVICE = process.env.SYNC_SERVICE_URL || 'http://localhost:3008';

export interface ServiceControl {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  port: number;
  description: string;
  routes: string[];
}

// Registry de Microservicios con Estado Dinámico (Toggle ON/OFF)
const serviceRegistry: Record<string, ServiceControl> = {
  auth: {
    id: 'auth',
    name: 'Auth Service',
    url: AUTH_SERVICE,
    enabled: true,
    port: 3001,
    description: 'Gestión de autenticación, emisión de JWT y sesiones.',
    routes: ['/api/auth'],
  },
  user: {
    id: 'user',
    name: 'User & Profile Service',
    url: USER_SERVICE,
    enabled: true,
    port: 3002,
    description: 'Gestión de usuarios, direcciones y métodos de pago.',
    routes: ['/api/users', '/api/user-details'],
  },
  product: {
    id: 'product',
    name: 'Product Catalog Service (CRUD)',
    url: PRODUCT_SERVICE,
    enabled: true,
    port: 3003,
    description: 'CRUD de productos, categorías, marcas y reseñas.',
    routes: ['/api/productos', '/api/categorias', '/api/emprendimientos', '/api/preguntas', '/api/resenas'],
  },
  order: {
    id: 'order',
    name: 'Order & Purchase Service',
    url: ORDER_SERVICE,
    enabled: true,
    port: 3004,
    description: 'Procesamiento de checkout, compras y órdenes.',
    routes: ['/api/compras', '/api/orders'],
  },
  cart: {
    id: 'cart',
    name: 'Shopping Cart Service',
    url: CART_SERVICE,
    enabled: true,
    port: 3005,
    description: 'Gestión del carrito de compras en tiempo real.',
    routes: ['/api/carrito'],
  },
  notification: {
    id: 'notification',
    name: 'Notification Service',
    url: NOTIFICATION_SERVICE,
    enabled: true,
    port: 3006,
    description: 'Consumidor de eventos RabbitMQ y notificaciones.',
    routes: ['/api/notificaciones'],
  },
  health: {
    id: 'health',
    name: 'Health & Monitor Service',
    url: HEALTH_SERVICE,
    enabled: true,
    port: 3007,
    description: 'Diagnósticos de salud de BDs y microservicios.',
    routes: ['/health'],
  },
  sync: {
    id: 'sync',
    name: 'Data Sync Service',
    url: SYNC_SERVICE,
    enabled: true,
    port: 3008,
    description: 'Sincronización asincrónica de réplicas de datos.',
    routes: ['/api/sync'],
  },
};

// Middleware de verificación de disponibilidad del microservicio
const checkServiceEnabled = (serviceKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const service = serviceRegistry[serviceKey];
    if (!service || !service.enabled) {
      res.status(503).json({
        error: 'Service Temporarily Unavailable',
        message: `El microservicio '${service?.name || serviceKey}' ha sido desactivado temporalmente por el administrador.`,
        serviceId: serviceKey,
        enabled: false,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  };
};

// --- ENDPOINTS DE CONTROL DEL API GATEWAY ---

// Obtener estado de todos los microservicios
app.get('/api/gateway/services', (req: Request, res: Response) => {
  res.json({
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString(),
    services: Object.values(serviceRegistry),
  });
});

// Cambiar estado ON/OFF de un microservicio
app.post('/api/gateway/services/toggle', (req: Request, res: Response) => {
  const { serviceId, enabled } = req.body;

  if (!serviceId || typeof enabled !== 'boolean') {
    res.status(400).json({ error: 'Parámetros inválidos. Se requiere serviceId (string) y enabled (boolean).' });
    return;
  }

  const service = serviceRegistry[serviceId];
  if (!service) {
    res.status(404).json({ error: `No se encontró el microservicio con ID '${serviceId}'.` });
    return;
  }

  service.enabled = enabled;
  console.log(`🎛️ Microservicio '${service.name}' (${serviceId}) cambiado a: ${enabled ? 'ACTIVADO (ON)' : 'DESACTIVADO (OFF)'}`);

  res.json({
    message: `Microservicio '${service.name}' ${enabled ? 'activado' : 'desactivado'} exitosamente.`,
    service,
    timestamp: new Date().toISOString(),
  });
});

// --- ENRUTAMIENTO CON PROXY & DEFENSA DE CIRCUITO ---

// Auth
app.use('/api/auth', checkServiceEnabled('auth'), createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true }));

// Users
app.use('/api/users', checkServiceEnabled('user'), createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));
app.use('/api/user-details', checkServiceEnabled('user'), createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));

// Products & Catalog (CRUD)
app.use('/api/productos', checkServiceEnabled('product'), createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/categorias', checkServiceEnabled('product'), createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/emprendimientos', checkServiceEnabled('product'), createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/preguntas', checkServiceEnabled('product'), createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/resenas', checkServiceEnabled('product'), createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));

// Orders & Purchases
app.use('/api/compras', checkServiceEnabled('order'), createProxyMiddleware({ target: ORDER_SERVICE, changeOrigin: true }));
app.use('/api/orders', checkServiceEnabled('order'), createProxyMiddleware({ target: ORDER_SERVICE, changeOrigin: true }));

// Cart
app.use('/api/carrito', checkServiceEnabled('cart'), createProxyMiddleware({ target: CART_SERVICE, changeOrigin: true }));

// Notifications
app.use('/api/notificaciones', checkServiceEnabled('notification'), createProxyMiddleware({ target: NOTIFICATION_SERVICE, changeOrigin: true }));

// Health
app.use('/health', checkServiceEnabled('health'), createProxyMiddleware({ target: HEALTH_SERVICE, changeOrigin: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'UNIMARKET API Gateway & Service Control Center Operational',
    timestamp: new Date(),
    availableServicesCount: Object.values(serviceRegistry).filter((s) => s.enabled).length,
    totalServicesCount: Object.keys(serviceRegistry).length,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UNIMARKET API Gateway & Control Center running on port ${PORT}`);
});

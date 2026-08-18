import express from 'express';
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
  max: 300,
  message: { error: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde.' },
});
app.use(limiter);

// Target Microservice URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://user-service:3002';
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:3004';
const CART_SERVICE = process.env.CART_SERVICE_URL || 'http://cart-service:3005';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';
const HEALTH_SERVICE = process.env.HEALTH_SERVICE_URL || 'http://health-service:3007';

// Proxy Route Mappings
app.use('/api/auth', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true }));
app.use('/api/users', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));
app.use('/api/user-details', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));

app.use('/api/productos', createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/categorias', createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/emprendimientos', createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/preguntas', createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));
app.use('/api/resenas', createProxyMiddleware({ target: PRODUCT_SERVICE, changeOrigin: true }));

app.use('/api/compras', createProxyMiddleware({ target: ORDER_SERVICE, changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: ORDER_SERVICE, changeOrigin: true }));

app.use('/api/carrito', createProxyMiddleware({ target: CART_SERVICE, changeOrigin: true }));
app.use('/api/notificaciones', createProxyMiddleware({ target: NOTIFICATION_SERVICE, changeOrigin: true }));
app.use('/health', createProxyMiddleware({ target: HEALTH_SERVICE, changeOrigin: true }));

app.get('/', (req, res) => {
  res.json({ message: 'UNIMARKET API Gateway operational', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Redis Cache
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  lazyConnect: true,
});
redis.connect().catch(() => console.warn('⚠️ Redis not available in Cart Service'));

// MongoDB Cart Schema
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
mongoose.connect(MONGO_URI).then(() => console.log('🍃 Cart Service connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const CartItemSchema = new mongoose.Schema({
  producto_id: Number,
  cantidad: Number,
  precio: Number,
  nombre: String,
  url_imagen: String,
});

const CartSchema = new mongoose.Schema({
  usuario_id: { type: Number, required: true, unique: true },
  items: [CartItemSchema],
  updated_at: { type: Date, default: Date.now }
});

const CartMongo = mongoose.model('Cart', CartSchema);

// Get Cart
app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers['x-user-id'] || 1);

    // Try Redis cache first
    try {
      const cachedCart = await redis.get(`cart_${userId}`);
      if (cachedCart) {
        res.json(JSON.parse(cachedCart));
        return;
      }
    } catch (_) {}

    let cart = await CartMongo.findOne({ usuario_id: userId });
    if (!cart) {
      cart = await CartMongo.create({ usuario_id: userId, items: [] });
    }

    try {
      await redis.setex(`cart_${userId}`, 300, JSON.stringify(cart));
    } catch (_) {}

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo carrito de compras' });
  }
});

// Add or Update Cart Item
app.post('/agregar', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers['x-user-id'] || req.body.usuario_id || 1);
    const { producto_id, cantidad, precio, nombre, url_imagen } = req.body;

    let cart = await CartMongo.findOne({ usuario_id: userId });
    if (!cart) {
      cart = new CartMongo({ usuario_id: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(item => item.producto_id === producto_id);
    if (existingIndex > -1) {
      cart.items[existingIndex].cantidad += (cantidad || 1);
    } else {
      cart.items.push({ producto_id, cantidad: cantidad || 1, precio, nombre, url_imagen });
    }

    cart.updated_at = new Date();
    await cart.save();

    try {
      await redis.del(`cart_${userId}`);
    } catch (_) {}

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error añadiendo ítem al carrito' });
  }
});

// Clear Cart
app.delete('/vaciar', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers['x-user-id'] || 1);
    await CartMongo.findOneAndUpdate({ usuario_id: userId }, { items: [], updated_at: new Date() });
    
    try {
      await redis.del(`cart_${userId}`);
    } catch (_) {}

    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error vaciando carrito' });
  }
});

app.listen(PORT, () => {
  console.log(`🛒 Cart Service (MongoDB) listening on port ${PORT}`);
});

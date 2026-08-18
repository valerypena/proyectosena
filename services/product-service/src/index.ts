import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// MySQL Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'unimarket',
});

// Redis Client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  lazyConnect: true,
});
redis.connect().catch(() => console.warn('⚠️ Redis fallback active'));

// Mongo MongoDB Read Replica Schema
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
mongoose.connect(MONGO_URI).then(() => {
  console.log('🍃 Product Service connected to MongoDB Read Replica');
}).catch(err => console.error('MongoDB error:', err));

const ProductMongoSchema = new mongoose.Schema({
  mysql_id: Number,
  nombre: String,
  descripcion: String,
  precio: Number,
  cantidad_stock: Number,
  url_imagen: String,
  categoria_id: Number,
  categoria_nombre: String,
  emprendimiento_id: Number,
  emprendimiento_nombre: String,
  creado_en: Date,
});
const ProductMongo = mongoose.model('ProductReplica', ProductMongoSchema);

// Get All Products (With High-Availability Circuit Fallback: Redis -> MySQL -> MongoDB)
app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { busqueda, categoria_id, min_precio, max_precio, limit = 50, page = 1 } = req.query;

    const cacheKey = `products_${busqueda}_${categoria_id}_${min_precio}_${max_precio}_${limit}_${page}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    } catch (_) {}

    try {
      let query = `
        SELECT p.*, c.nombre as categoria_nombre, e.nombre_marca as emprendimiento_nombre 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN emprendimientos e ON p.emprendimiento_id = e.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (busqueda) {
        query += ` AND (p.nombre LIKE ? OR p.descripcion LIKE ?)`;
        params.push(`%${busqueda}%`, `%${busqueda}%`);
      }
      if (categoria_id) {
        query += ` AND p.categoria_id = ?`;
        params.push(categoria_id);
      }
      if (min_precio) {
        query += ` AND p.precio >= ?`;
        params.push(min_precio);
      }
      if (max_precio) {
        query += ` AND p.precio <= ?`;
        params.push(max_precio);
      }

      query += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;
      const offset = (Number(page) - 1) * Number(limit);
      params.push(Number(limit), offset);

      const [rows] = await pool.execute(query, params);

      try {
        await redis.setex(cacheKey, 60, JSON.stringify(rows));
      } catch (_) {}

      res.json(rows);
    } catch (mysqlError) {
      console.warn('⚠️ MySQL unavaliable, falling back to MongoDB Read Replica');
      const filter: any = {};
      if (busqueda) {
        filter.nombre = { $regex: busqueda, $options: 'i' };
      }
      if (categoria_id) {
        filter.categoria_id = Number(categoria_id);
      }
      const mongoDocs = await ProductMongo.find(filter).limit(Number(limit));
      res.json(mongoDocs);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error obteniendo catálogo de productos' });
  }
});

// Get Categories
app.get('/categorias', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categorias ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo categorías' });
  }
});

// Get Product By ID
app.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const [rows]: any = await pool.execute(
      `SELECT p.*, c.nombre as categoria_nombre, e.nombre_marca as emprendimiento_nombre 
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN emprendimientos e ON p.emprendimiento_id = e.id
       WHERE p.id = ?`,
      [productId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo detalle de producto' });
  }
});

app.listen(PORT, () => {
  console.log(`📦 Product Service listening on port ${PORT}`);
});

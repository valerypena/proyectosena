import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

// Connections
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'unimarket',
  connectionLimit: 5,
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
mongoose.connect(MONGO_URI).then(() => console.log('🍃 Sync Service connected to MongoDB'))
  .catch(err => console.error('MongoDB sync connection error:', err));

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

let channel: amqp.Channel | null = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

async function initRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('unimarket_events', 'topic', { durable: true });
    console.log('✅ Sync Service connected to RabbitMQ');
  } catch (err) {
    console.error('RabbitMQ connect error:', err);
    setTimeout(initRabbitMQ, 5000);
  }
}

initRabbitMQ();

// Ensure Outbox Table Exists
async function ensureOutboxTable() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS outbox_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aggregate_type VARCHAR(50) NOT NULL,
        aggregate_id VARCHAR(50) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        payload JSON NOT NULL,
        status ENUM('PENDING', 'PROCESSED', 'FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Outbox table ensure error:', err);
  }
}

ensureOutboxTable();

// Outbox Poller Worker & Sync Loop
async function processOutboxAndSync() {
  try {
    // 1. Process Outbox Events
    const [events]: any = await pool.execute(
      `SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 50`
    );

    for (const event of events) {
      if (channel) {
        const payload = Buffer.from(JSON.stringify({
          routingKey: event.event_type,
          data: typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload,
          timestamp: event.created_at
        }));

        const published = channel.publish('unimarket_events', event.event_type, payload, { persistent: true });
        if (published) {
          await pool.execute(`UPDATE outbox_events SET status = 'PROCESSED' WHERE id = ?`, [event.id]);
        }
      }
    }

    // 2. Continuous Full Product Catalog Sync to MongoDB Read Replica
    const [products]: any = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre, e.nombre_marca as emprendimiento_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN emprendimientos e ON p.emprendimiento_id = e.id
    `);

    for (const prod of products) {
      await ProductMongo.findOneAndUpdate(
        { mysql_id: prod.id },
        {
          mysql_id: prod.id,
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: Number(prod.precio),
          cantidad_stock: prod.cantidad_stock,
          url_imagen: prod.url_imagen,
          categoria_id: prod.categoria_id,
          categoria_nombre: prod.categoria_nombre,
          emprendimiento_id: prod.emprendimiento_id,
          emprendimiento_nombre: prod.emprendimiento_nombre,
          creado_en: prod.creado_en
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.warn('⚠️ Sync cycle error (will retry next interval):', err);
  }
}

// Run polling loop every 5 seconds
console.log('🔄 Sync Service started outbox polling & replica synchronization');
setInterval(processOutboxAndSync, 5000);

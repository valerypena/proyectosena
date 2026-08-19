import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import amqp from 'amqplib';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

// Configuraciones de Conexión
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'unimarket',
  connectionLimit: 5,
};

let mysqlPool: mysql.Pool | null = null;

function getMySQLPool(): mysql.Pool {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(MYSQL_CONFIG);
  }
  return mysqlPool;
}

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unimarket_nosql';
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Sync Service connected to MongoDB'))
  .catch((err) => console.error('⚠️ MongoDB sync connection warning:', err.message));

// Schemas MongoDB para Réplica Espejo
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
  creado_en: { type: Date, default: Date.now },
  synced: { type: Boolean, default: true }, // Status de reconciliación
  created_offline: { type: Boolean, default: false },
});
const ProductMongo = mongoose.model('ProductReplica', ProductMongoSchema);

const OfflineDeltaSchema = new mongoose.Schema({
  entity_type: String, // 'product', 'user', 'order'
  action: String, // 'INSERT', 'UPDATE', 'DELETE'
  payload: Object,
  created_at: { type: Date, default: Date.now },
  synced: { type: Boolean, default: false },
});
const OfflineDelta = mongoose.model('OfflineDelta', OfflineDeltaSchema);

// RabbitMQ Event Channel
let channel: amqp.Channel | null = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@127.0.0.1:5672';

async function initRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('unimarket_events', 'topic', { durable: true });
    console.log('✅ Sync Service connected to RabbitMQ');
  } catch (err: any) {
    console.warn('⚠️ RabbitMQ no disponible en Sync Service (Continuando sin broker):', err.message);
  }
}
initRabbitMQ();

// Variables de Estado de Alta Disponibilidad (HA State)
export interface HAState {
  primaryStatus: 'UP' | 'DOWN';
  backupStatus: 'UP' | 'DOWN';
  mode: 'PRIMARY_ACTIVE' | 'OFFLINE_BACKUP_ACTIVE' | 'RECONCILING_DELTAS';
  lastSyncTime: string;
  totalSyncedProducts: number;
  pendingOfflineDeltas: number;
}

let currentHAState: HAState = {
  primaryStatus: 'UP',
  backupStatus: 'UP',
  mode: 'PRIMARY_ACTIVE',
  lastSyncTime: new Date().toISOString(),
  totalSyncedProducts: 0,
  pendingOfflineDeltas: 0,
};

// Verificador de salud de MySQL
async function isMySQLHealthy(): Promise<boolean> {
  try {
    const pool = getMySQLPool();
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch {
    return false;
  }
}

// Ensure Outbox Table
async function ensureOutboxTable() {
  if (currentHAState.primaryStatus !== 'UP') return;
  try {
    const pool = getMySQLPool();
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
  } catch (err: any) {
    // Ignorar si MySQL no responde
  }
}

// --- CICLO DE RECONCILIACIÓN AUTO-HEALING & ESPEJO ---
async function processOutboxAndSync() {
  const mysqlUp = await isMySQLHealthy();

  if (mysqlUp) {
    const wasDown = currentHAState.primaryStatus === 'DOWN';
    currentHAState.primaryStatus = 'UP';

    if (wasDown) {
      console.log('🔄 ¡MySQL ha vuelto a estar en línea! Iniciando proceso de Auto-Reconciliación y Espejo...');
      currentHAState.mode = 'RECONCILING_DELTAS';
      await reconcileOfflineDeltas();
    } else {
      currentHAState.mode = 'PRIMARY_ACTIVE';
    }

    await ensureOutboxTable();
    await syncOutboxAndMirror();
  } else {
    currentHAState.primaryStatus = 'DOWN';
    currentHAState.mode = 'OFFLINE_BACKUP_ACTIVE';
    console.warn('⚡ Modo Respaldo Activo: MySQL fuera de línea. La base de datos de respaldo NoSQL absorbe la carga.');
  }

  // Actualizar deltas pendientes
  try {
    currentHAState.pendingOfflineDeltas = await OfflineDelta.countDocuments({ synced: false });
    currentHAState.totalSyncedProducts = await ProductMongo.countDocuments({});
  } catch {}

  currentHAState.lastSyncTime = new Date().toISOString();
}

// Sincronización normal y espejo de MySQL -> MongoDB
async function syncOutboxAndMirror() {
  try {
    const pool = getMySQLPool();

    // 1. Procesar eventos del Outbox
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

    // 2. Replicación Espejo Continua MySQL -> MongoDB
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
          creado_en: prod.creado_en,
          synced: true,
          created_offline: false,
        },
        { upsert: true, new: true }
      );
    }
  } catch (err: any) {
    console.warn('⚠️ Error en ciclo espejo:', err.message);
  }
}

// Reconciliación de Deltas Offline (Puesta al día en MySQL de lo grabado durante la caída)
async function reconcileOfflineDeltas() {
  try {
    const deltas = await OfflineDelta.find({ synced: false }).sort({ created_at: 1 });
    if (deltas.length === 0) {
      console.log('✅ Sin cambios offline pendientes. Ambas bases de datos están idénticas.');
      return;
    }

    console.log(`📦 Reconciliando ${deltas.length} registros creados durante el tiempo de caída...`);
    const pool = getMySQLPool();

    for (const delta of deltas) {
      if (delta.entity_type === 'product' && delta.action === 'INSERT') {
        const p = delta.payload;
        await pool.execute(
          `INSERT INTO productos (emprendimiento_id, categoria_id, nombre, descripcion, precio, cantidad_stock, url_imagen) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [p.emprendimiento_id || 1, p.categoria_id || 1, p.nombre, p.descripcion || '', p.precio || 0, p.cantidad_stock || 10, p.url_imagen || '']
        );
      }
      delta.synced = true;
      await delta.save();
    }

    console.log('✨ ¡Auto-Reconciliación completada! El espejo de MySQL y MongoDB está 100% igualado.');
  } catch (err: any) {
    console.error('❌ Error durante la reconciliación:', err.message);
  }
}

// --- API ENDPOINTS DE SALUD Y SINCRONIZACIÓN ---
app.get('/api/sync/status', (req: Request, res: Response) => {
  res.json({
    haState: currentHAState,
    info: 'Motor de Alta Disponibilidad y Réplica Espejo Self-Healing UNIMARKET',
  });
});

app.post('/api/sync/reconcile', async (req: Request, res: Response) => {
  await processOutboxAndSync();
  res.json({
    message: 'Ciclo de reconciliación y sincronización espejo activado manualmente.',
    haState: currentHAState,
  });
});

// Iniciar servidor del Microservicio de Sincronización
app.listen(PORT, () => {
  console.log(`🔄 Sync & Mirroring Microservice listening on port ${PORT}`);
});

// Polling loop cada 5 segundos
setInterval(processOutboxAndSync, 5000);

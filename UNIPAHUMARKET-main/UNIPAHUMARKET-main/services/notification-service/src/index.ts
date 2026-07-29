import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import amqp from 'amqplib';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// MongoDB Notification & Audit Log Schema
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
mongoose.connect(MONGO_URI).then(() => console.log('🍃 Notification Service connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const NotificationSchema = new mongoose.Schema({
  usuario_id: Number,
  tipo: String,
  titulo: String,
  mensaje: String,
  leido: { type: Boolean, default: false },
  creado_en: { type: Date, default: Date.now }
});

const NotificationMongo = mongoose.model('Notification', NotificationSchema);

const SystemAuditSchema = new mongoose.Schema({
  event_type: String,
  payload: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

const SystemAuditMongo = mongoose.model('SystemAudit', SystemAuditSchema);

// RabbitMQ Event Consumer Setup
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

async function startRabbitMQConsumer() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange('unimarket_events', 'topic', { durable: true });

    const q = await ch.assertQueue('notification_queue', { durable: true });
    await ch.bindQueue(q.queue, 'unimarket_events', '#'); // Listen to all events

    ch.consume(q.queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await SystemAuditMongo.create({
            event_type: content.routingKey || 'system_event',
            payload: content.data
          });

          if (content.routingKey === 'order.created') {
            await NotificationMongo.create({
              usuario_id: content.data.userId,
              tipo: 'COMPRA',
              titulo: '¡Compra Confirmada!',
              mensaje: `Tu orden #${content.data.orderId} por $${content.data.montoTotal} ha sido procesada con éxito.`
            });
          }

          ch.ack(msg);
        } catch (err) {
          console.error('Error processing notification event:', err);
          ch.nack(msg, false, false);
        }
      }
    });
    console.log('📬 Notification Service listening for RabbitMQ events');
  } catch (err) {
    console.error('RabbitMQ connection retry in 5s:', err);
    setTimeout(startRabbitMQConsumer, 5000);
  }
}

startRabbitMQConsumer();

// Get User Notifications
app.get('/usuario/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const notifs = await NotificationMongo.find({ usuario_id: userId }).sort({ creado_en: -1 }).limit(50);
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo notificaciones' });
  }
});

// Mark as read
app.put('/:id/leido', async (req: Request, res: Response): Promise<void> => {
  try {
    await NotificationMongo.findByIdAndUpdate(req.params.id, { leido: true });
    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando notificación' });
  }
});

app.listen(PORT, () => {
  console.log(`🔔 Notification Service (MongoDB) listening on port ${PORT}`);
});

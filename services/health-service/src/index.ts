import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import amqp from 'amqplib';
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// MySQL connection check
async function checkMySQL(): Promise<{ status: string; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'unimarket',
    });
    await conn.ping();
    await conn.end();
    return { status: 'UP', latencyMs: Date.now() - start };
  } catch (err: any) {
    return { status: 'DOWN', error: err.message };
  }
}

// MongoDB connection check
async function checkMongoDB(): Promise<{ status: string; error?: string }> {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unimarket_nosql';
    const conn = await mongoose.createConnection(MONGO_URI).asPromise();
    const isUp = conn.readyState === 1;
    await conn.close();
    return isUp ? { status: 'UP' } : { status: 'DOWN' };
  } catch (err: any) {
    return { status: 'DOWN', error: err.message };
  }
}

// Redis connection check
async function checkRedis(): Promise<{ status: string; error?: string }> {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      connectTimeout: 1000,
    });
    const pong = await redis.ping();
    await redis.quit();
    return pong === 'PONG' ? { status: 'UP' } : { status: 'DOWN' };
  } catch (err: any) {
    return { status: 'DOWN', error: err.message };
  }
}

// RabbitMQ connection check
async function checkRabbitMQ(): Promise<{ status: string; error?: string }> {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@127.0.0.1:5672');
    await conn.close();
    return { status: 'UP' };
  } catch (err: any) {
    return { status: 'DOWN', error: err.message };
  }
}

// Microservice HTTP Ping check
async function checkHttpPort(port: number): Promise<{ status: string; latencyMs?: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      resolve({ status: 'UP', latencyMs: Date.now() - start });
    });
    req.on('error', () => {
      resolve({ status: 'DOWN' });
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve({ status: 'DOWN' });
    });
  });
}

app.get('/health', async (req: Request, res: Response): Promise<void> => {
  const [mysqlRes, mongoRes, redisRes, rabbitRes] = await Promise.all([
    checkMySQL(),
    checkMongoDB(),
    checkRedis(),
    checkRabbitMQ(),
  ]);

  const microservicesCheck = {
    auth: await checkHttpPort(3001),
    user: await checkHttpPort(3002),
    product: await checkHttpPort(3003),
    order: await checkHttpPort(3004),
    cart: await checkHttpPort(3005),
    notification: await checkHttpPort(3006),
    health: { status: 'UP', latencyMs: 0 },
    sync: await checkHttpPort(3008),
    fastapi_backend: await checkHttpPort(8000),
  };

  const allHealthy = mysqlRes.status === 'UP';

  res.status(allHealthy ? 200 : 207).json({
    status: allHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    databases: {
      mysql: mysqlRes,
      mongodb: mongoRes,
      redis: redisRes,
      rabbitmq: rabbitRes,
    },
    microservices: microservicesCheck,
  });
});

app.listen(PORT, () => {
  console.log(`🩺 Health & Monitor Service listening on port ${PORT}`);
});

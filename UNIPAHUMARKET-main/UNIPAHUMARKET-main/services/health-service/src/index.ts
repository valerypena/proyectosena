import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import amqp from 'amqplib';

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
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'rootpassword',
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
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
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
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      connectTimeout: 2000,
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
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
    await conn.close();
    return { status: 'UP' };
  } catch (err: any) {
    return { status: 'DOWN', error: err.message };
  }
}

app.get('/health', async (req: Request, res: Response): Promise<void> => {
  const [mysqlRes, mongoRes, redisRes, rabbitRes] = await Promise.all([
    checkMySQL(),
    checkMongoDB(),
    checkRedis(),
    checkRabbitMQ(),
  ]);

  const allHealthy = mysqlRes.status === 'UP' && mongoRes.status === 'UP' && redisRes.status === 'UP' && rabbitRes.status === 'UP';

  res.status(allHealthy ? 200 : 207).json({
    status: allHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    services: {
      mysql: mysqlRes,
      mongodb: mongoRes,
      redis: redisRes,
      rabbitmq: rabbitRes,
    },
  });
});

app.listen(PORT, () => {
  console.log(`🩺 Health & Monitor Service listening on port ${PORT}`);
});

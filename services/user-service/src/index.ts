import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimarket_nosql';
mongoose.connect(MONGO_URI).then(() => {
  console.log('🍃 User Service connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema for User Preferences
const UserPreferenceSchema = new mongoose.Schema({
  userId: Number,
  theme: { type: String, default: 'light' },
  notificationsEnabled: { type: Boolean, default: true },
  favoriteCategories: [Number],
  updatedAt: { type: Date, default: Date.now }
});
const UserPreference = mongoose.model('UserPreference', UserPreferenceSchema);

// Get User Addresses
app.get('/direcciones', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const [rows] = await pool.execute('SELECT * FROM direcciones WHERE usuario_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo direcciones' });
  }
});

// Create User Address
app.post('/direcciones', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const { provincia, ciudad, calle, numero, piso_depto, codigo_postal, telefono_contacto, referencias } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO direcciones (usuario_id, provincia, ciudad, calle, numero, piso_depto, codigo_postal, telefono_contacto, referencias)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, provincia, ciudad, calle, numero, piso_depto || null, codigo_postal || null, telefono_contacto, referencias || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Dirección creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando dirección' });
  }
});

// Get User Preferences (from MongoDB)
app.get('/preferencias/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    let prefs = await UserPreference.findOne({ userId });
    if (!prefs) {
      prefs = await UserPreference.create({ userId });
    }
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo preferencias' });
  }
});

app.listen(PORT, () => {
  console.log(`👤 User Service listening on port ${PORT}`);
});

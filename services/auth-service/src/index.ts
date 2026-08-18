import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'unimarket_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Database Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'unimarket',
  waitForConnections: true,
  connectionLimit: 10,
});

// Login Endpoint
app.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    const [rows]: any = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.contrasena_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('Auth Login Error:', error);
    res.status(500).json({ error: 'Error interno de autenticación' });
  }
});

// Register Endpoint
app.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre_completo, email, password, documento, ocupacion, rol } = req.body;

    if (!nombre_completo || !email || !password) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
      return;
    }

    const [existing]: any = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      res.status(400).json({ error: 'El email ya se encuentra registrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = rol || 'COMPRADOR';

    const [result]: any = await pool.execute(
      `INSERT INTO usuarios (nombre_completo, email, contrasena_hash, documento, ocupacion, rol) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_completo, email, passwordHash, documento || null, ocupacion || null, userRole]
    );

    const newUserId = result.insertId;

    const token = jwt.sign(
      { sub: newUserId, email, rol: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: newUserId,
        nombre_completo,
        email,
        rol: userRole,
      },
    });
  } catch (error) {
    console.error('Auth Register Error:', error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

app.get('/me', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const [rows]: any = await pool.execute('SELECT id, nombre_completo, email, documento, ocupacion, rol FROM usuarios WHERE id = ?', [payload.sub]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service listening on port ${PORT}`);
});

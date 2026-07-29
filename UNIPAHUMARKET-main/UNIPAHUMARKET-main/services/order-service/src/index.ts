import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

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

// Create Order (Checkout)
app.post('/', async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.headers['x-user-id'] || req.body.usuario_id || 1;
    const { direccion_id, metodo_pago, items } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'La orden debe contener al menos un producto' });
      return;
    }

    let montoTotal = 0;
    for (const item of items) {
      montoTotal += Number(item.precio) * Number(item.cantidad);
    }

    // Insert Compra
    const [orderResult]: any = await connection.execute(
      `INSERT INTO compras (usuario_id, monto_total, estado, direccion_id, metodo_pago)
       VALUES (?, ?, 'PAGADO', ?, ?)`,
      [userId, montoTotal, direccion_id || null, metodo_pago || 'TARJETA']
    );

    const orderId = orderResult.insertId;

    // Insert Items and deduct stock
    for (const item of items) {
      await connection.execute(
        `INSERT INTO items_compra (compra_id, producto_id, cantidad, precio_al_comprar)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.producto_id, item.cantidad, item.precio]
      );

      await connection.execute(
        `UPDATE productos SET cantidad_stock = cantidad_stock - ? WHERE id = ?`,
        [item.cantidad, item.producto_id]
      );
    }

    // Insert into Outbox Table for Asynchronous Eventual Consistency
    await connection.execute(
      `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, status)
       VALUES ('ORDER', ?, 'order.created', ?, 'PENDING')`,
      [String(orderId), JSON.stringify({ orderId, userId, montoTotal, items })]
    );

    await connection.commit();

    res.status(201).json({
      id: orderId,
      monto_total: montoTotal,
      estado: 'PAGADO',
      message: 'Orden creada exitosamente',
    });
  } catch (error) {
    await connection.rollback();
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Error procesando la compra' });
  } finally {
    connection.release();
  }
});

// Get User Orders
app.get('/mis-compras', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const [orders]: any = await pool.execute('SELECT * FROM compras WHERE usuario_id = ? ORDER BY id DESC', [userId]);

    for (const order of orders) {
      const [items]: any = await pool.execute(
        `SELECT ic.*, p.nombre, p.url_imagen 
         FROM items_compra ic 
         JOIN productos p ON ic.producto_id = p.id 
         WHERE ic.compra_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo compras' });
  }
});

app.listen(PORT, () => {
  console.log(`🛒 Order Service listening on port ${PORT}`);
});

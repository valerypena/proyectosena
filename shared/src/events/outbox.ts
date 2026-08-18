import { Pool } from 'mysql2/promise';

export interface OutboxEvent {
  id?: number;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  payload: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  created_at?: Date;
}

export class OutboxRepository {
  constructor(private readonly pool: Pool) {}

  public async initTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS outbox_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aggregate_type VARCHAR(50) NOT NULL,
        aggregate_id VARCHAR(50) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        payload JSON NOT NULL,
        status ENUM('PENDING', 'PROCESSED', 'FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.execute(sql);
  }

  public async saveEvent(event: OutboxEvent): Promise<void> {
    const sql = `
      INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.pool.execute(sql, [
      event.aggregate_type,
      event.aggregate_id,
      event.event_type,
      JSON.stringify(event.payload),
      event.status || 'PENDING'
    ]);
  }

  public async fetchPendingEvents(limit: number = 50): Promise<OutboxEvent[]> {
    const [rows]: any = await this.pool.execute(
      `SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT ?`,
      [limit]
    );
    return rows;
  }

  public async markAsProcessed(id: number): Promise<void> {
    await this.pool.execute(`UPDATE outbox_events SET status = 'PROCESSED' WHERE id = ?`, [id]);
  }

  public async markAsFailed(id: number): Promise<void> {
    await this.pool.execute(`UPDATE outbox_events SET status = 'FAILED' WHERE id = ?`, [id]);
  }
}

import amqp, { ChannelModel, Channel } from 'amqplib';

export class EventBus {
  private static instance: EventBus;
  private connection: any = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private readonly exchange: string = 'unimarket_events';

  private constructor() {
    this.url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await (this.connection as any).createChannel();
      await this.channel!.assertExchange(this.exchange, 'topic', { durable: true });
      console.log('✅ Connected to RabbitMQ Event Bus');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ Event Bus:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  public async publish(routingKey: string, message: any): Promise<boolean> {
    if (!this.channel) {
      console.warn('⚠️ EventBus channel not ready. Retrying connection...');
      await this.connect();
    }

    try {
      const payload = Buffer.from(JSON.stringify({
        routingKey,
        data: message,
        timestamp: new Date().toISOString()
      }));
      return this.channel!.publish(this.exchange, routingKey, payload, { persistent: true });
    } catch (error) {
      console.error(`❌ Failed to publish event [${routingKey}]:`, error);
      return false;
    }
  }

  public async subscribe(queueName: string, routingKey: string, handler: (data: any) => Promise<void>): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }

    try {
      const q = await this.channel!.assertQueue(queueName, { durable: true });
      await this.channel!.bindQueue(q.queue, this.exchange, routingKey);

      this.channel!.consume(q.queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content.data);
            this.channel!.ack(msg);
          } catch (err) {
            console.error(`❌ Error processing event [${routingKey}]:`, err);
            this.channel!.nack(msg, false, false);
          }
        }
      });
      console.log(`📥 Subscribed queue [${queueName}] to routing key [${routingKey}]`);
    } catch (error) {
      console.error(`❌ Subscription error for [${routingKey}]:`, error);
    }
  }
}

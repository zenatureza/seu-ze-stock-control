import { Connection, Channel, connect, Message, ConsumeMessage } from 'amqplib';
import IQueueProvider from '../interfaces/IQueueProvider';

export default class RabbitmqServer implements IQueueProvider {
  private conn: Connection;
  private channel: Channel;

  constructor(private uri: string) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string,
  ): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: string, callback: (message: ConsumeMessage) => void) {
    return this.channel.consume(queue, message => {
      if (!message) return;

      callback(message);
      this.channel.ack(message);
    });
  }
}

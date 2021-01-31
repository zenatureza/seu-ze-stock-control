import { Connection, Channel, connect, Message, ConsumeMessage } from 'amqplib';
import { container, inject, injectable } from 'tsyringe';

import UpdateProductStockService from '@modules/products/services/UpdateProductInStockService';
import IQueueProvider from '../interfaces/IQueueProvider';

// TODO: Refactor this file, because it's not a provider itself
class RabbitmqServer implements IQueueProvider {
  private conn: Connection;
  private channel: Channel;
  public updateProductInStockService: UpdateProductStockService;

  constructor(
    private uri: string,
    private routingKey: string,
    private queue: string,
  ) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();

    // Assert a queue into existence.
    this.channel.assertQueue(this.queue, { durable: true });
    this.channel.bindQueue(this.queue, 'stock', this.routingKey);

    this.updateProductInStockService = container.resolve(
      UpdateProductStockService,
    );
  }

  async consume(callback: (message: ConsumeMessage) => void) {
    return this.channel.consume(this.queue, message => {
      if (!message) return;

      callback(message);
      this.channel.ack(message);
    });
  }
}

// TODO: Replace magic string with .env variables
const stockIncrementConsumer = async () => {
  const routingKey = 'incremented';
  const rabbitMqServer = new RabbitmqServer(
    'amqp://guest:guest@rabbitmq:5672',
    routingKey,
    `${routingKey}-queue`,
  );

  await rabbitMqServer.start();
  await rabbitMqServer.consume(message => {
    // console.log('💧 increment: ', message.content.toString());
    rabbitMqServer.updateProductInStockService.execute(message, 'increment');
  });
};

const stockDecrementConsumer = async () => {
  const routingKey = 'decremented';
  const rabbitMqServer = new RabbitmqServer(
    'amqp://guest:guest@rabbitmq:5672',
    routingKey,
    `${routingKey}-queue`,
  );

  await rabbitMqServer.start();
  await rabbitMqServer.consume(message => {
    // console.log('🔥 decrement: ', message.content.toString());
    rabbitMqServer.updateProductInStockService.execute(message, 'decrement');
  });
};

// stockIncrementConsumer();
// stockDecrementConsumer();

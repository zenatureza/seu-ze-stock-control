import { Connection, Channel, connect, Message, ConsumeMessage } from 'amqplib';
import { container, inject, injectable } from 'tsyringe';

import UpdateProductInStockService from '@modules/products/services/UpdateProductInStockService';
import IRabbitMqProvider from '../interfaces/IRabbitMqProvider';

import RabbitMqConfig from '@config/rabbitMq';

class RabbitmqServer implements IRabbitMqProvider {
  private conn: Connection;
  private channel: Channel;
  public updateProductInStockService: UpdateProductInStockService;

  constructor(private routingKey: string, private queue: string) {}

  async start(): Promise<any> {
    try {
      this.conn = await connect(
        `amqp://${RabbitMqConfig.username}:${RabbitMqConfig.password}@${RabbitMqConfig.hostname}:${RabbitMqConfig.port}`,
      );
    } catch (error) {
      console.error(error.message);
      return setTimeout(this.start, 1000);
    }

    this.conn.on('close', err => {
      console.log(`🐰 ${this.routingKey} closed: `, err);
      return setTimeout(this.start, 1000);
    });

    this.conn.on('error', err => {
      console.log(`🐰 ${this.routingKey} error: `, err);
      return setTimeout(this.start, 1000);
    });

    this.channel = await this.conn.createChannel();

    // Assert a queue into existence.
    this.channel.assertQueue(this.queue, { durable: true });
    this.channel.bindQueue(this.queue, 'stock', this.routingKey);

    this.updateProductInStockService = container.resolve(
      UpdateProductInStockService,
    );
  }

  async consume(callback: (message: ConsumeMessage) => void) {
    return this.channel.consume(this.queue, message => {
      // TODO: should log this problem!
      if (!message) return;

      callback(message);
      this.channel.ack(message);
    });
  }
}

const stockIncrementConsumer = async () => {
  const routingKey = 'incremented';
  const rabbitMqServer = new RabbitmqServer(routingKey, `${routingKey}-queue`);

  await rabbitMqServer.start();
  await rabbitMqServer.consume(message => {
    // console.log('💧 increment: ', message.content.toString());
    rabbitMqServer.updateProductInStockService.execute(message, 'increment');
  });
};

const stockDecrementConsumer = async () => {
  const routingKey = 'decremented';
  const rabbitMqServer = new RabbitmqServer(routingKey, `${routingKey}-queue`);

  await rabbitMqServer.start();
  await rabbitMqServer.consume(message => {
    // console.log('🔥 decrement: ', message.content.toString());
    rabbitMqServer.updateProductInStockService.execute(message, 'decrement');
  });
};

stockIncrementConsumer();
stockDecrementConsumer();

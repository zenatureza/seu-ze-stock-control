import { Connection, Channel, connect, Message, ConsumeMessage } from 'amqplib';
import { container, inject, injectable } from 'tsyringe';
import RedisCacheProvider from '../../CacheProvider/implementations/RedisCacheProvider';
// import ICacheProvider from '../../CacheProvider/interfaces/ICacheProvider';
import IQueueProvider from '../interfaces/IQueueProvider';

// export default
class RabbitmqServer implements IQueueProvider {
  private conn: Connection;
  private channel: Channel;
  public cacheProvider: RedisCacheProvider;

  constructor(
    private uri: string,
    private routingKey: string,
    private queue: string, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();

    // Assert a queue into existence.
    this.channel.assertQueue(this.queue, { durable: true });
    this.channel.bindQueue(this.queue, 'stock', this.routingKey);

    this.cacheProvider = container.resolve(RedisCacheProvider);
  }

  // async publishInQueue(queue: string, message: string) {
  //   return this.channel.sendToQueue(queue, Buffer.from(message));
  // }

  // async publishInExchange(
  //   exchange: string,
  //   routingKey: string,
  //   message: string,
  // ): Promise<boolean> {
  //   return this.channel.publish(exchange, routingKey, Buffer.from(message));
  // }

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
    'amqp://guest:guest@localhost:5672',
    routingKey,
    `${routingKey}-queue`,
  );

  await rabbitMqServer.start();
  await rabbitMqServer.consume(message =>
    console.log('👾 incrementing: ', message.content.toString()),
  );
};

const stockDecrementConsumer = async () => {
  const routingKey = 'decremented';
  const rabbitMqServer = new RabbitmqServer(
    'amqp://guest:guest@localhost:5672',
    routingKey,
    `${routingKey}-queue`,
  );

  await rabbitMqServer.start();

  await rabbitMqServer.consume(message => {
    const productName = message.content.toString();
    console.log('🔥 decrementing: ', productName);

    // TODO: should call stockUpdateService.handle(productName: string, operation: 'incremented' | 'decremented')
    rabbitMqServer.cacheProvider
      .recover<number>(productName)
      .then(cacheQuantity => {
        if (typeof cacheQuantity !== 'number') return;

        const quantity = cacheQuantity + 1;
        rabbitMqServer.cacheProvider.save(productName, quantity);
      });
  });
};

// stockIncrementConsumer();
stockDecrementConsumer();

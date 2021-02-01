import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import IStockServiceLogger from '@shared/infra/logs/interfaces/IStockServiceLogger';
import StockServiceLogger from '@shared/infra/logs/StockServiceLogger';
import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'tsyringe';

/**
 * Used to update products quantities after a rabbitmq message
 */
@injectable()
class UpdateProductInStockService {
  private executeOperation = {
    increment: (currentQuantity: number): number => {
      // console.log('🐬 incrementing: ', currentQuantity);
      return currentQuantity + 1;
    },
    decrement: (currentQuantity: number): number => {
      if (currentQuantity <= 0) return 0;

      return currentQuantity - 1;
    },
  };

  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StockServiceLogger')
    private stockServiceLogger: IStockServiceLogger,
  ) {}

  public async execute(
    stockControlServiceMessage: ConsumeMessage,
    operation: 'increment' | 'decrement',
  ): Promise<number> {
    // console.log(this.cacheProvider);

    // if receives invalid message from stock service
    if (
      !stockControlServiceMessage ||
      !stockControlServiceMessage.content ||
      !stockControlServiceMessage.content.toString()
    ) {
      // TODO: should log this problem!
      // stock
      console.log('Invalid message from RabbitMq stock control service.');
      this.stockServiceLogger.log(
        'Invalid message from RabbitMq stock control service.',
      );
      return -1;
    }

    // it's necessary to remove double quotes to recover it back later
    const productName = stockControlServiceMessage.content
      .toString('utf8')
      .replace(/"/g, '');

    // updates product quantity in cache
    let updatedQuantity = 0;

    try {
      const cacheQuantity = await this.cacheProvider.recover<number>(
        productName,
      );

      // couldn't find product in cache, then adds it
      if (
        !this.cacheProvider.exists(productName) ||
        typeof cacheQuantity !== 'number'
      ) {
        // console.log('could not find: ', productName);
        updatedQuantity = operation === 'decrement' ? 0 : 1;

        await this.cacheProvider.save(productName, updatedQuantity);
        return updatedQuantity;
      }

      updatedQuantity = this.executeOperation[operation](cacheQuantity);

      // if (productName.toLowerCase() === 'kiwi') {
      //   console.log(
      //     `${
      //       operation === 'increment' ? '🐬' : '🔥'
      //     } updating ${productName} quantity to: ${updatedQuantity}`,
      //   );
      // }
      await this.cacheProvider.save(productName, updatedQuantity);

      return updatedQuantity;
    } catch (error) {
      this.stockServiceLogger.log('');
      return -1;
    }
  }
}

export default UpdateProductInStockService;

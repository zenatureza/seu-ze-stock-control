import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'tsyringe';

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
  ) {}

  public async execute(
    stockControlServiceMessage: ConsumeMessage,
    operation: 'increment' | 'decrement',
  ): Promise<number> {
    // if receives invalid message from stock service
    if (
      !stockControlServiceMessage ||
      !stockControlServiceMessage.content ||
      !stockControlServiceMessage.content.toString()
    ) {
      // TODO: should log this problem!
      return -1;
    }

    const productName = stockControlServiceMessage.content.toString();

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
        updatedQuantity = operation === 'decrement' ? 0 : 1;

        this.cacheProvider.save(productName, updatedQuantity);
        return updatedQuantity;
      }

      updatedQuantity = this.executeOperation[operation](cacheQuantity);
      // console.log(
      //   `${
      //     operation === 'increment' ? '🐬' : '🔥'
      //   } updating ${productName} quantity to: ${updatedQuantity}`,
      // );
      this.cacheProvider.save(productName, updatedQuantity);

      return updatedQuantity;
    } catch (error) {
      // TODO: should log this problem!
      return -1;
    }
  }
}

export default UpdateProductInStockService;

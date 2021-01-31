import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateProductStockService {
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
      if (typeof cacheQuantity !== 'number') {
        updatedQuantity = operation === 'decrement' ? 0 : 1;
        this.cacheProvider.save(productName, updatedQuantity);
        return updatedQuantity;
      }

      // can't have negative quantity
      if (cacheQuantity === 0 && operation === 'decrement') return 0;

      updatedQuantity =
        operation === 'increment' ? cacheQuantity + 1 : cacheQuantity - 1;
      console.log(
        `${
          operation === 'increment' ? '🐬' : '🔥'
        } updating ${productName} quantity to: ${updatedQuantity}`,
      );
      this.cacheProvider.save(productName, updatedQuantity);

      return updatedQuantity;
    } catch (error) {
      // TODO: should log this problem!
    }

    return updatedQuantity;
  }
}

export default UpdateProductStockService;

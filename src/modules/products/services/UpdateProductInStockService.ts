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
  ): Promise<void> {
    // TODO: should log this problem!
    // if receives invalid message from stock service
    if (
      !stockControlServiceMessage ||
      !stockControlServiceMessage.content ||
      !stockControlServiceMessage.content.toString()
    )
      return;

    const productName = stockControlServiceMessage.content.toString();

    // updates product quantity in cache
    this.cacheProvider.recover<number>(productName).then(cacheQuantity => {
      if (typeof cacheQuantity !== 'number') return;

      // can't have negative quantity
      if (cacheQuantity === 0 && operation === 'decrement') return;

      const updatedQuantity =
        operation === 'increment' ? cacheQuantity + 1 : cacheQuantity - 1;
      console.log(
        `${
          operation === 'increment' ? '🐬' : '🔥'
        } updating ${productName} quantity to: ${updatedQuantity}`,
      );
      this.cacheProvider.save(productName, updatedQuantity);
    });
  }
}

export default UpdateProductStockService;

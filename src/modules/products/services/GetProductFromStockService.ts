import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
class GetProductFromStockService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  // TODO: should return dto or not found
  public async execute(
    productName: string,
  ): Promise<IGetProductFromStockDTO | undefined> {
    const productInDb = await this.productsRepository.findByName(productName);

    // TODO: should throw or use error handling message
    if (!productInDb) return;

    // first should check on redis (most recent data)
    const productQuantityInCache = await this.cacheProvider.recover<number>(
      productName,
    );

    // couldn't find product quantity in cache
    if (typeof productQuantityInCache !== 'number') {
      await this.cacheProvider.save(productName, productInDb.quantity);
    } else {
      // updates product quantity in database
      productInDb.quantity = productQuantityInCache;
      await this.productsRepository.save(productInDb);
    }

    const productDTO: IGetProductFromStockDTO = {
      name: productName,
      price: productInDb.price,
      quantity: productInDb.quantity,
    };

    return productDTO;
  }
}

export default GetProductFromStockService;

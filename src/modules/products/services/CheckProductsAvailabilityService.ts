import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import AppError from '@shared/errors/AppError';
import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';

@injectable()
class CheckProductsAvailabilityService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(
    // productsNames: string[],
    products: ICreateOrderProductDTO[],
  ): Promise<IGetProductFromStockDTO[] | undefined> {
    const productsNames = products.map(p => p.name);

    // all products must be in the database
    const productsDb = await this.productsRepository.findByNames(productsNames);
    // console.log('👨‍💻 productsDb: ', productsDb);
    // console.log('👨‍💻 productsNames: ', productsNames);

    if (
      !productsDb ||
      productsDb.length <= 0 ||
      productsDb.length !== productsNames.length
    ) {
      throw new AppError('Could not find these products.');
    }

    // tries to get products most updated quantities
    const productsCache = await this.cacheProvider.recoverAll(productsNames);

    const result: IGetProductFromStockDTO[] = [];

    productsDb.forEach(productDb => {
      const productCacheValue = productsCache?.get(productDb.name);

      let productAvailableQuantity = -1;
      if (productCacheValue) {
        productAvailableQuantity = parseInt(productCacheValue);
      } else {
        productAvailableQuantity = productDb.quantity;
      }

      // products quantities are never negative values
      if (productAvailableQuantity < 0) {
        throw new AppError(`${productDb.name} is unavailable.`);
      }

      // checks if products quantities needed are available
      const productOrderQuantity = products.find(p => p.name === productDb.name)
        ?.quantity;
      if (
        !productOrderQuantity ||
        productOrderQuantity < 0 ||
        productOrderQuantity > productAvailableQuantity
      ) {
        throw new AppError(`${productDb.name} is unavailable.`);
      }

      const productDTO: IGetProductFromStockDTO = {
        name: productDb.name,
        price: productDb.price,
        quantity: productAvailableQuantity,
      };

      result.push(productDTO);
    });

    return result;
  }
}

export default CheckProductsAvailabilityService;

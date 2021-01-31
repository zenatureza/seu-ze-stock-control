import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import Product from '../infra/typeorm/schemas/Product.schema';

@injectable()
class UpdateProductsQuantitiesInStockService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(
    orderProducts: ICreateOrderProductDTO[],
  ): Promise<Product[]> {
    // tries to get most recent data
    const productsCache = await this.cacheProvider.recoverAll(
      orderProducts.map(p => p.name),
    );

    orderProducts.forEach(async product => {
      let updatedQuantity = 0;

      // if cache has the most recent data..
      if (productsCache && productsCache.has(product.name)) {
        const currentCacheQuantity = productsCache.get(product.name);

        if (typeof currentCacheQuantity === 'string') {
          updatedQuantity = Math.abs(
            parseInt(currentCacheQuantity) - product.quantity,
          );
          console.log(`🔥 ${product.name}_updated_quantity:`, updatedQuantity);

          await this.cacheProvider.save(product.name, updatedQuantity);
        }
      }
    });

    const productsDb = await this.productsRepository.findByNames(
      orderProducts.map(p => p.name),
    );

    if (!productsDb) {
      throw new AppError('Could not finish the transaction.');
    }

    // updates mongodb
    productsDb?.forEach(productDb => {
      const orderProductQuantity = orderProducts.find(
        x => x.name === productDb.name,
      )?.quantity;
      const updatedQuantity = Math.abs(
        productDb.quantity - (orderProductQuantity ?? 0),
      );

      if (typeof updatedQuantity === 'number') {
        productDb.quantity = updatedQuantity;
      }
    });

    await this.productsRepository.saveAll(productsDb);

    return productsDb;
  }
}

export default UpdateProductsQuantitiesInStockService;

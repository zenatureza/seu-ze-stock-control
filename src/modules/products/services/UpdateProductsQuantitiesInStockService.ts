import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import Product from '../infra/typeorm/schemas/Product.schema';
import getProductUpdatedQuantity from './GetProductUpdatedQuantityService';
import isNumeric from '@shared/infra/utils/isNumeric';
import { getCacheKey } from '@shared/container/providers/CacheProvider/utils/getCacheKey';

/**
 * Used to update products after an order creation
 */
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
    const productsDb = await this.productsRepository.findByNames(
      orderProducts.map(p => p.name),
    );

    // ensures all products in database
    if (
      !productsDb ||
      productsDb.length <= 0 ||
      productsDb.length < orderProducts.length ||
      !orderProducts.every(op =>
        productsDb.map(db => db.name).includes(op.name),
      )
    ) {
      // console.log('🐬 throwing AppError..');
      throw new AppError('Could not find these products.');
    }

    // tries to get most recent data
    const productsCache = await this.cacheProvider.recoverAll(
      orderProducts.map(p => p.name),
    );

    orderProducts.forEach(async orderProduct => {
      let updatedQuantity = 0;
      const productDb = productsDb.find(
        x => x.name === orderProduct.name,
      ) as any;

      // if cache has the most recent data..
      const cacheKey = getCacheKey(orderProduct.name);
      if (productsCache && productsCache.has(cacheKey)) {
        const currentCacheQuantity = productsCache.get(cacheKey);

        // ensures a valid quantity
        if (isNumeric(currentCacheQuantity)) {
          updatedQuantity = getProductUpdatedQuantity(
            parseInt(currentCacheQuantity as any),
            orderProduct.quantity,
          );
        } else {
          // updates cache with a valid quantity
          updatedQuantity = getProductUpdatedQuantity(
            productDb.quantity,
            orderProduct.quantity,
          );
        }

        await this.cacheProvider.save(cacheKey, updatedQuantity);
      }
      // stores product quantity in cache if not found
      else {
        await this.cacheProvider.save(
          orderProduct.name,
          getProductUpdatedQuantity(productDb.quantity, orderProduct.quantity),
        );
      }

      // updates database quantities
      productDb.quantity = getProductUpdatedQuantity(
        productDb.quantity,
        orderProduct.quantity,
      );
    });

    await this.productsRepository.saveAll(productsDb);

    return productsDb;
  }
}

export default UpdateProductsQuantitiesInStockService;

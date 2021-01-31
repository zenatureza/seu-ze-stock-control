import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';
import AppError from '@shared/errors/AppError';
import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import isNumeric from '@shared/infra/utils/isNumeric';

@injectable()
class CheckProductsAvailabilityService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(
    orderProducts: ICreateOrderProductDTO[],
  ): Promise<IGetProductFromStockDTO[] | undefined> {
    const productsNames = orderProducts.map(p => p.name);

    // all products must be in the database
    const productsDb = await this.productsRepository.findByNames(productsNames);

    if (
      !productsDb ||
      productsDb.length <= 0 ||
      productsDb.length < productsNames.length ||
      !orderProducts.every(op =>
        productsDb.map(db => db.name).includes(op.name),
      )
    ) {
      throw new AppError('Could not find these products.');
    }

    // validates requested products quantities
    const productsWithInvalidQuantities = orderProducts.filter(
      op => op.quantity <= 0,
    );
    if (
      productsWithInvalidQuantities &&
      productsWithInvalidQuantities.length > 0
    ) {
      throw new AppError(
        `The following products quantities are invalid: ${productsWithInvalidQuantities
          .map(p => p.name)
          .join(', ')}`,
      );
    }

    // tries to get products most updated quantities
    const productsCache = await this.cacheProvider.recoverAll(productsNames);

    const result: IGetProductFromStockDTO[] = [];

    let unavailableProducts: string[] = [];
    await orderProducts.forEach(async orderProduct => {
      const productDb = productsDb.find(
        p => p.name === orderProduct.name,
      ) as any;

      let productAvailableQuantity = productDb.quantity;

      // tries retrieves most recent quantity
      if (productsCache && productsCache.size > 0) {
        const productCacheValue = productsCache.get(productDb.name) as any;

        if (isNumeric(productCacheValue) && parseInt(productCacheValue) >= 0) {
          productAvailableQuantity = parseInt(productCacheValue);
        } else {
          productAvailableQuantity = productDb.quantity;
        }
      } else {
        // should set cache
        await this.cacheProvider.save(
          orderProduct.name,
          productAvailableQuantity,
        );
      }

      const productOrderQuantity = orderProduct.quantity;

      if (
        !productOrderQuantity ||
        productOrderQuantity > productAvailableQuantity
      ) {
        unavailableProducts.push(productDb.name);
        return;
      }

      const productDTO: IGetProductFromStockDTO = {
        name: productDb.name,
        price: productDb.price,
        quantity: productAvailableQuantity,
      };

      result.push(productDTO);
    });

    if (unavailableProducts.length > 0) {
      throw new AppError(
        `The following products are unavailable in the specified quantities: ${unavailableProducts.join(
          ', ',
        )}`,
      );
    }

    return result;
  }
}

export default CheckProductsAvailabilityService;

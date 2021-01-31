import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import AppError from '@shared/errors/AppError';
import { ObjectID } from 'mongodb';

import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import ProductsRepositoryMock from '../repositories/mocks/ProductsRepositoryMock';
import getProductUpdatedQuantity from './GetProductUpdatedQuantityService';
import GetProductUpdatedQuantityService from './GetProductUpdatedQuantityService';
import UpdateProductsQuantitiesInStockService from './UpdateProductsQuantitiesInStockService';

let updateProductsQuantitiesInStockService: UpdateProductsQuantitiesInStockService;
let productsRepositoryMock: ProductsRepositoryMock;
let cacheProviderMock: RedisCacheProviderMock;

const garlicDbQuantity = 1;
const kiwiDbQuantity = 1;

describe('UpdateProductsQuantitiesInStockService', () => {
  beforeEach(() => {
    productsRepositoryMock = new ProductsRepositoryMock([
      {
        name: 'Garlic',
        quantity: garlicDbQuantity,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: kiwiDbQuantity,
        price: 10,
      },
      {
        name: 'Allium',
        quantity: 1,
        price: 10,
      },
      {
        name: 'Bread',
        quantity: 1,
        price: 10,
      },
    ]);
    cacheProviderMock = new RedisCacheProviderMock({
      Garlic: garlicDbQuantity.toString(),
      Kiwi: kiwiDbQuantity.toString(),
      Bread: 'a',
    });

    updateProductsQuantitiesInStockService = new UpdateProductsQuantitiesInStockService(
      cacheProviderMock,
      productsRepositoryMock,
    );
  });

  it('should update all products quantities', async () => {
    const garlicOrderQuantity = 1;
    const kiwiOrderQuantity = 1;

    const orderProducts: ICreateOrderProductDTO[] = [
      {
        name: 'Garlic',
        quantity: garlicOrderQuantity,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: kiwiOrderQuantity,
        price: 10,
      },
    ];

    const updatedProducts = await updateProductsQuantitiesInStockService.execute(
      orderProducts,
    );

    // Garlic
    const garlic = updatedProducts.find(x => x.name === 'Garlic');
    expect(garlic?.quantity).toBe(
      Math.abs(garlicDbQuantity - garlicOrderQuantity),
    );

    // Kiwi
    const kiwi = updatedProducts.find(x => x.name === 'Kiwi');
    expect(kiwi?.quantity).toBe(Math.abs(kiwiDbQuantity - kiwiOrderQuantity));
  });

  it('should not update quantities when products were not found', async () => {
    const orderProducts: ICreateOrderProductDTO[] = [
      {
        name: 'Garlic',
        quantity: 1,
        price: 10,
      },
      {
        name: 'Kiwis',
        quantity: 1,
        price: 10,
      },
    ];

    await expect(
      updateProductsQuantitiesInStockService.execute(orderProducts),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should set product quantity as its own database value when its order quantity is undefined', async () => {
    const orderProducts: ICreateOrderProductDTO[] = [
      {
        name: 'Garlic',
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: 1,
        price: 10,
      },
    ] as any;

    const productsDb = await updateProductsQuantitiesInStockService.execute(
      orderProducts,
    );

    expect(productsDb[0].quantity).toBe(garlicDbQuantity);
  });

  it('should update product quantity in cache when its not found - only in database', async () => {
    const orderProducts: ICreateOrderProductDTO[] = [
      {
        name: 'Garlic',
        price: 10,
        quantity: 1,
      },
      {
        name: 'Kiwi',
        quantity: 1,
        price: 10,
      },
      {
        name: 'Allium',
        quantity: 1,
        price: 10,
      },
      {
        name: 'Bread',
        quantity: 1,
        price: 10,
      },
    ] as any;

    const productsDb = await updateProductsQuantitiesInStockService.execute(
      orderProducts,
    );

    expect(productsDb[0].quantity).toBe(
      getProductUpdatedQuantity(garlicDbQuantity, 1),
    );
  });
});

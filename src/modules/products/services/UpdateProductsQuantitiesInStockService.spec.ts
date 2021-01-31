import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import { ObjectID } from 'mongodb';

import IGetProductFromStockDTO from '../dtos/IGetProductFromStockDTO';
import ProductsRepositoryMock from '../repositories/mocks/ProductsRepositoryMock';
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
    ]);
    cacheProviderMock = new RedisCacheProviderMock({
      Garlic: garlicDbQuantity.toString(),
      Kiwi: kiwiDbQuantity.toString(),
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
});

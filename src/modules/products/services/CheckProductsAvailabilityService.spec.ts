import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import AppError from '@shared/errors/AppError';
import ProductsRepositoryMock from '../repositories/mocks/ProductsRepositoryMock';
import CheckProductsAvailabilityService from './CheckProductsAvailabilityService';

let productsRepositoryMock: ProductsRepositoryMock;
let cacheProviderMock: RedisCacheProviderMock;
let checkProductsAvailabilityService: CheckProductsAvailabilityService;

let garlicCacheQuantity = 6;
let kiwiDbQuantity = 4;

describe('CheckProductsAvailabilityService', () => {
  beforeEach(() => {
    productsRepositoryMock = new ProductsRepositoryMock([
      {
        name: 'Garlic',
        quantity: 5,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: kiwiDbQuantity,
        price: 10,
      },
    ]);
    cacheProviderMock = new RedisCacheProviderMock({
      Garlic: garlicCacheQuantity.toString(),
    });

    checkProductsAvailabilityService = new CheckProductsAvailabilityService(
      cacheProviderMock,
      productsRepositoryMock,
    );
  });

  it("should be able to get these products, because they're all available", async () => {
    let orderProducts: ICreateOrderProductDTO[] = [];
    orderProducts.push({
      name: 'Garlic',
      quantity: 2,
      price: 10,
    });
    orderProducts.push({
      name: 'Kiwi',
      quantity: 1,
      price: 10,
    });

    const productsInStock = await checkProductsAvailabilityService.execute(
      orderProducts,
    );

    expect(productsInStock?.length).toBe(orderProducts.length);
  });

  it('should not be able to get these products, because the orders quantity is bigger than 10', async () => {
    let orderProducts: ICreateOrderProductDTO[] = [];
    orderProducts.push({
      name: 'Garlic',
      quantity: 11,
      price: 10,
    });
    orderProducts.push({
      name: 'Kiwi',
      quantity: 1,
      price: 10,
    });

    await expect(
      checkProductsAvailabilityService.execute(orderProducts),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to find any product', async () => {
    let orderProducts: ICreateOrderProductDTO[] = [];

    await expect(
      checkProductsAvailabilityService.execute(orderProducts),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when any product quantity is negative', async () => {
    let orderProducts: ICreateOrderProductDTO[] = [];
    orderProducts.push({
      name: 'Garlic',
      quantity: 2,
      price: 10,
    });
    orderProducts.push({
      name: 'Kiwi',
      quantity: -1,
      price: 10,
    });

    await expect(
      checkProductsAvailabilityService.execute(orderProducts),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should get most updated quantity from cache', async () => {
    const orderProducts = [
      {
        name: 'Garlic',
        quantity: 2,
        price: 10,
      },
    ];

    const products = (await checkProductsAvailabilityService.execute(
      orderProducts,
    )) as any;

    expect(products[0].quantity).toBe(garlicCacheQuantity);
  });

  it('should set cache quantity, if key not present on it, with database value', async () => {
    const result = (await checkProductsAvailabilityService.execute([
      {
        name: 'Kiwi',
        quantity: 2,
        price: 10,
      },
    ])) as any;

    cacheProviderMock.setCacheData({});

    expect(result[0].quantity).toBe(kiwiDbQuantity);
  });
});

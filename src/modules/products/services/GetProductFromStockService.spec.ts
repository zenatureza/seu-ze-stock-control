import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import AppError from '@shared/errors/AppError';
import ProductsRepositoryMock from '../repositories/mocks/ProductsRepositoryMock';
import GetProductFromStockService from './GetProductFromStockService';

let productsRepositoryMock: ProductsRepositoryMock;
let cacheProviderMock: RedisCacheProviderMock;
let getProductFromStockService: GetProductFromStockService;

let garlicCacheQuantity = 2;
let kiwiDbQuantity = 1;

describe('GetProductFromStockService', () => {
  beforeEach(() => {
    productsRepositoryMock = new ProductsRepositoryMock([
      { name: 'Garlic', price: 10, quantity: 1 },
      { name: 'Kiwi', price: 10, quantity: kiwiDbQuantity },
    ]);
    cacheProviderMock = new RedisCacheProviderMock({
      Garlic: garlicCacheQuantity.toString(),
    });

    getProductFromStockService = new GetProductFromStockService(
      cacheProviderMock,
      productsRepositoryMock,
    );
  });

  it('should be able to get a product from stock', async () => {
    const productName = 'Garlic';

    const product = await getProductFromStockService.execute(productName);

    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('quantity');
    expect(product?.name).toBe(productName);
  });

  it('should not find inexistent product and throw error', async () => {
    const productName = 'Garlicsss';

    await expect(
      getProductFromStockService.execute(productName),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should save product quantity in cache when its not found', async () => {
    const productName = 'Kiwi';

    const product = await getProductFromStockService.execute(productName);

    expect(product?.quantity).toBe(kiwiDbQuantity);
  });

  it('should update product quantity in database with caches quantity', async () => {
    const productName = 'Garlic';

    const product = await getProductFromStockService.execute(productName);

    expect(product?.quantity).toBe(garlicCacheQuantity);
  });
});

import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import ProductsRepositoryMock from '../repositories/mocks/ProductsRepositoryMock';
import GetProductFromStockService from './GetProductFromStockService';

let productsRepositoryMock: ProductsRepositoryMock;
let cacheProviderMock: RedisCacheProviderMock;
let getProductFromStockService: GetProductFromStockService;

describe('GetProductFromStockService', () => {
  beforeEach(() => {
    productsRepositoryMock = new ProductsRepositoryMock();
    cacheProviderMock = new RedisCacheProviderMock();

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
});

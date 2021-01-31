import ProductsRepositoryMock from '@modules/products/repositories/mocks/ProductsRepositoryMock';
import CheckProductsAvailabilityService from '@modules/products/services/CheckProductsAvailabilityService';
import UpdateProductsQuantitiesInStockService from '@modules/products/services/UpdateProductsQuantitiesInStockService';
import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import AppError from '@shared/errors/AppError';
import OrdersRepositoryMock from '../repositories/mocks/OrdersRepositoryMock';
import CreateOrderService from './CreateOrderService';

let ordersRepositoryMock: OrdersRepositoryMock;
let createOrderService: CreateOrderService;
let checksProductsAvailabilityService: CheckProductsAvailabilityService;
let productsRepositoryMock: ProductsRepositoryMock;
let cacheProviderMock: RedisCacheProviderMock;
let updateProductsQuantitiesInStockService: UpdateProductsQuantitiesInStockService;

describe('CreateOrder', () => {
  beforeEach(() => {
    ordersRepositoryMock = new OrdersRepositoryMock();
    productsRepositoryMock = new ProductsRepositoryMock([
      {
        name: 'Garlic',
        quantity: 5,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: 4,
        price: 10,
      },
    ]);
    cacheProviderMock = new RedisCacheProviderMock();
    checksProductsAvailabilityService = new CheckProductsAvailabilityService(
      cacheProviderMock,
      productsRepositoryMock,
    );

    updateProductsQuantitiesInStockService = new UpdateProductsQuantitiesInStockService(
      cacheProviderMock,
      productsRepositoryMock,
    );

    createOrderService = new CreateOrderService(
      ordersRepositoryMock,
      checksProductsAvailabilityService,
      updateProductsQuantitiesInStockService,
    );
  });

  it('should be able to create a new order', async () => {
    const products = [
      {
        name: 'Garlic',
        quantity: 1,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: 4,
        price: 10,
      },
    ];
    const garlicPrice = 1;
    const kiwiPrice = 1;
    const total = garlicPrice * 1 + kiwiPrice * 4;

    const order = await createOrderService.execute({
      products,
    });

    expect(order).toHaveProperty('id');
    order.products.forEach(product => {
      expect(product).toHaveProperty('price');
    });
  });

  it('should not be able to create a new order when some product quantity is bigger than its stock', async () => {
    const products = [
      {
        name: 'Garlic',
        quantity: 11,
        price: 10,
      },
      {
        name: 'Kiwi',
        quantity: 4,
        price: 10,
      },
    ];

    await expect(
      createOrderService.execute({ products }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

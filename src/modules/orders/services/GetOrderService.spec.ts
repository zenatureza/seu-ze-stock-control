import AppError from '@shared/errors/AppError';
import OrdersRepositoryMock from '../repositories/mocks/OrdersRepositoryMock';
import GetOrderService from './GetOrderService';

let ordersRepositoryMock: OrdersRepositoryMock;
let getOrderService: GetOrderService;

describe('GetOrderService', () => {
  beforeEach(() => {
    ordersRepositoryMock = new OrdersRepositoryMock(
      [{ name: 'Kiwi', price: 10, quantity: 1 }],
      undefined,
      ['125'],
    );
    getOrderService = new GetOrderService(ordersRepositoryMock);
  });

  it('should be able to get the order', async () => {
    const id = '125';

    const order = await getOrderService.execute(id);

    expect(order.id).toBe(id);
  });

  it('should not be able to get the order when theres an invalid id', async () => {
    const id = '';

    await expect(getOrderService.execute(id)).rejects.toBeInstanceOf(AppError);
  });
});

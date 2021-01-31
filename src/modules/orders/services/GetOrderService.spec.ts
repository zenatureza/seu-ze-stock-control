import OrdersRepositoryMock from '../repositories/mocks/OrdersRepositoryMock';
import GetOrderService from './GetOrderService';

let ordersRepositoryMock: OrdersRepositoryMock;
let getOrderService: GetOrderService;

describe('GetOrderService', () => {
  beforeEach(() => {
    ordersRepositoryMock = new OrdersRepositoryMock([
      {
        name: 'Garlic',
        price: 10,
        quantity: 5,
      },
    ]);
    getOrderService = new GetOrderService(ordersRepositoryMock);
  });

  it('should be able to get the order', async () => {
    const id = '125';

    const order = await getOrderService.execute(id);

    expect(order.id).toBe(id);
  });
});

import { ObjectID } from 'mongodb';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import IGetOrderDTO from '../dtos/IGetOrderDTO';
import OrdersRepositoryMock from '../repositories/mocks/OrdersRepositoryMock';
import GetPagedOrdersService from './GetPagedOrdersService';

let ordersRepositoryMock: OrdersRepositoryMock;
let getPagedOrdersService: GetPagedOrdersService;

describe('GetPagedOrdersService', () => {
  beforeEach(() => {
    const orders: IGetOrderDTO[] = [
      {
        id: '',
        products: [{ name: 'Garlic', price: 10, quantity: 10 }],
        total: 100,
      },
      {
        id: '',
        products: [{ name: 'Kiwi', price: 20, quantity: 10 }],
        total: 200,
      },
    ];
    ordersRepositoryMock = new OrdersRepositoryMock(undefined, orders);
    getPagedOrdersService = new GetPagedOrdersService(ordersRepositoryMock);
  });

  it('should be able to get the first orders', async () => {
    const page = 1;

    const orders = await getPagedOrdersService.execute(page);

    expect(orders.length).toBeGreaterThan(0);
  });
});

describe('GetPagedOrdersService - Fails', () => {
  beforeEach(() => {
    ordersRepositoryMock = new OrdersRepositoryMock();
    getPagedOrdersService = new GetPagedOrdersService(ordersRepositoryMock);
  });

  it('should not be able to get orders', async () => {
    const page = 2;

    const orders = await getPagedOrdersService.execute(page);

    expect(orders.length).toBe(0);
  });
});

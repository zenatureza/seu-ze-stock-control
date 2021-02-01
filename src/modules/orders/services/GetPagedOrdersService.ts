import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGetOrderDTO from '../dtos/IGetOrderDTO';
import IOrdersRepository from '../repositories/IOrdersRepository';

@injectable()
class GetPagedOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute(page: number): Promise<IGetOrderDTO[]> {
    const pagedOrders = await this.ordersRepository.getPaged(page);

    const result: IGetOrderDTO[] = [];

    console.log('🪴 pagedOrders: ', pagedOrders);

    if (pagedOrders && pagedOrders.length > 0) {
      pagedOrders.forEach(order => {
        result.push({
          id: order.id.toString(),
          products: order.products.map(product => {
            return {
              name: product.name,
              price: product.price,
              quantity: product.quantity,
            };
          }),
          total: order.getTotal(),
        });
      });
    }

    return result;
  }
}

export default GetPagedOrderService;

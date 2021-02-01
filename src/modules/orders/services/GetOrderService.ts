import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGetOrderDTO from '../dtos/IGetOrderDTO';
import IOrdersRepository from '../repositories/IOrdersRepository';

@injectable()
class GetOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute(id: string): Promise<IGetOrderDTO> {
    const order = await this.ordersRepository.get(id);

    if (!order) {
      throw new AppError('Could not found the requested order.', 404);
    }

    const orderProducts = order.products.map(p => {
      return {
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      };
    });

    const result: IGetOrderDTO = {
      id,
      products: orderProducts,
      total: order.getTotal(),
    };

    return result;
  }
}

export default GetOrderService;

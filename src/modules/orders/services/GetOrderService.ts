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
    try {
      const order = await this.ordersRepository.get(id);

      if (!order) {
        throw new AppError('Could not found the requested order.', 400);
      }

      const result: IGetOrderDTO = {
        id,
        products: order.products.map(p => {
          console.log(p.price);
          return {
            name: p.name,
            price: p.price,
            quantity: p.quantity,
          };
        }),
        total: parseFloat(order.total.toString()),
      };

      return result;
    } catch (error) {
      throw new AppError('Could not found the requested order.', 400);
    }
  }
}

export default GetOrderService;

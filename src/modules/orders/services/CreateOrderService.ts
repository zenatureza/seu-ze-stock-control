import { inject, injectable } from 'tsyringe';

import ICreateOrderProductDTO from '../dtos/CreateOrderProductDTO';
import Order from '../infra/typeorm/schemas/Order.schema';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

// interface IProductRequest {
//   name: string;
//   quantity: number;
// }

interface IRequest {
  products: ICreateOrderProductDTO[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}
  public async execute({ products }: IRequest): Promise<Order> {
    // TODO: 1. this.checkStockService.execute(checkStock(products))
    // TODO: 3. if (productsAreAvailable) this.updateStockService.execute(products)

    // Step 2
    const order = await this.ordersRepository.create({
      products,
      total: products
        .map(x => x.quantity)
        .reduce((a, c) => {
          return a + c;
        }),
    });

    return new Order();
  }
}

export default CreateOrderService;

import { inject, injectable } from 'tsyringe';

import ICreateOrderProductDTO from '../dtos/CreateOrderProductDTO';
import Order from '../infra/typeorm/schemas/Order.schema';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import Product from '@modules/products/infra/typeorm/schemas/Product';
import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}
  public async execute({ products }: IRequest): Promise<Order> {
    // TODO: 1. this.checkStockService.execute(checkStock(products))
    // TODO: 3. if (productsAreAvailable) this.updateStockService.execute(products)
    await this.checkStock({ products });

    // Step 2
    const order = await this.ordersRepository.create({
      products,
      total: products
        .map(x => x.quantity)
        .reduce((a, c) => {
          return a + c;
        }),
    });

    return order;
  }

  private async checkStock({ products }: IRequest): Promise<Order> {
    const keys = products.map(p => p.name);

    // const products = this.cacheProvider.recover<Product[]>(
    //   keys
    // );

    const productsCache = [];

    const product = await this.cacheProvider.recover<Product>(keys[0]);
    console.log(product);

    return new Order();
  }
}

export default CreateOrderService;

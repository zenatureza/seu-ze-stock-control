import {
  getCustomRepository,
  getMongoManager,
  getMongoRepository,
  getRepository,
  MongoRepository,
} from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import Order from '../schemas/Order.schema';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Product from '@modules/products/infra/typeorm/schemas/Product.schema';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: MongoRepository<Order>;

  constructor() {
    this.ormRepository = getMongoRepository(Order);
  }

  public async create({ products, total }: ICreateOrderDTO): Promise<Order> {
    const productsDb: Product[] = [];
    products.forEach(p => {
      const product = new Product(p.name, p.quantity);

      productsDb.push(product);
    });

    const order = new Order();
    order.products = productsDb;
    order.total = total;

    await this.ormRepository.save(order);

    return order;
  }

  public async get(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }
}

export default OrdersRepository;

import {
  getCustomRepository,
  getMongoManager,
  getMongoRepository,
  getRepository,
  MongoRepository,
} from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import Order from '../schemas/Order.schema';
import ICreateOrderDTO from '@modules/orders/dtos/CreateOrderDTO';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: MongoRepository<Order>;

  constructor() {
    this.ormRepository = getMongoRepository(Order);
  }

  public async create({ products, total }: ICreateOrderDTO): Promise<Order> {
    // const orderProducts = products.map(x => )

    const order = this.ormRepository.create({
      total,
    });

    await this.ormRepository.save(order);

    return order;
  }
}

export default OrdersRepository;

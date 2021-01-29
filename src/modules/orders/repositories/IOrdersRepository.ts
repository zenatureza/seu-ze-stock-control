import ICreateOrderDTO from '../dtos/CreateOrderDTO';
import Order from '../infra/typeorm/schemas/Order.schema';

export default interface IOrdersRepository {
  create(data: ICreateOrderDTO): Promise<Order>;
}
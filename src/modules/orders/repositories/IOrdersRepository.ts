import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/schemas/Order.schema';

export default interface IOrdersRepository {
  create(data: ICreateOrderDTO): Promise<Order>;
  get(id: string): Promise<Order | undefined>;
}

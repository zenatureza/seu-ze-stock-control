import Product from '@modules/products/infra/typeorm/schemas/Product.schema';
import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('orders')
class Order {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  total: Number;

  @Column(type => Product)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  public getTotal(): number {
    return parseFloat(this.total.toString());
  }
}

export default Order;

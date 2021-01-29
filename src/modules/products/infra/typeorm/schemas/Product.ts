import {
  ObjectID,
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;

import {
  ObjectID,
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('stockservicelogs')
class StockServiceLog {
  @ObjectIdColumn()
  id: ObjectID;

  // user defined message
  @Column()
  message: string;

  @Column()
  stockControlServiceMessageContent: string;

  @CreateDateColumn()
  created_at: Date;

  constructor(message: string, stockControlServiceMessageContent?: string) {
    this.message = message;
    this.stockControlServiceMessageContent =
      stockControlServiceMessageContent ?? '';
  }
}

export default StockServiceLog;

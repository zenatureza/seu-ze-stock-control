import IStockServiceLogsRepository from '@modules/products/repositories/IStockServiceLogsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import StockServiceLog from '../schemas/StockServiceLog.schema';

class StockServiceLogsRepository implements IStockServiceLogsRepository {
  private ormRepository: MongoRepository<StockServiceLog>;

  constructor() {
    this.ormRepository = getMongoRepository(StockServiceLog);
  }

  public async create(
    message: string,
    stockControlServiceMessageContent?: string,
  ): Promise<StockServiceLog> {
    const createdLog = new StockServiceLog(
      message,
      stockControlServiceMessageContent,
    );

    return await this.ormRepository.save(createdLog);
  }
}

export default StockServiceLogsRepository;

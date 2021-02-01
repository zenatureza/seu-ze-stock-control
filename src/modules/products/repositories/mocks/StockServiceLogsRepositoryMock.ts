import StockServiceLog from '@modules/products/infra/typeorm/schemas/StockServiceLog.schema';
import IStockServiceLogsRepository from '@modules/products/repositories/IStockServiceLogsRepository';

class StockServiceLogsRepositoryMock implements IStockServiceLogsRepository {
  public async create(
    message: string,
    stockControlServiceMessageContent?: string,
  ): Promise<StockServiceLog> {
    const createdLog = new StockServiceLog(
      message,
      stockControlServiceMessageContent,
    );

    return createdLog;
  }
}

export default StockServiceLogsRepositoryMock;

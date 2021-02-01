import StockServiceLog from '../infra/typeorm/schemas/StockServiceLog.schema';

export default interface IStockServiceLogsRepository {
  create(
    message: string,
    stockControlServiceMessageContent?: string,
  ): Promise<StockServiceLog>;
}

import StockServiceLogsRepository from '@modules/products/infra/typeorm/repositories/StockServiceLogsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class StockServiceLogger {
  constructor(
    @inject('StockServiceLogsRepository')
    private stockServiceLogsRepository: StockServiceLogsRepository,
  ) {}

  async log(message: string, stockControlServiceMessageContent?: string) {
    await this.stockServiceLogsRepository.create(
      message,
      stockControlServiceMessageContent,
    );
  }
}

export default StockServiceLogger;

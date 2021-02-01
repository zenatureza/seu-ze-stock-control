import { Logger } from 'mongodb';
import IStockServiceLogger from '../interfaces/IStockServiceLogger';

// TODO: register in container
class StockServiceLogger implements IStockServiceLogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('StockServiceLogger');
  }

  log(message: string) {
    if (this.logger.isInfo()) {
      this.logger.info('StockServiceLog: ', {
        message,
        date: 0,
        className: 'StockServiceLog',
        pid: 0,
        type: 'StockServiceLog',
      });
    }

    // return null;
  }
}

export default StockServiceLogger;

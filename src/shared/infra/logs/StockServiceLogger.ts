import { Logger } from 'mongodb';

// TODO: register in container
class StockServiceLogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('StockServiceLogger');
  }

  log(message: string) {
    if (this.logger.isInfo()) {
      this.logger.info('StockServiceLog: ', {
        message,
        date: Date.now(),
        className: 'StockServiceLog',
        pid: 0,
        type: 'StockServiceLog',
      });
    }
  }
}

export default StockServiceLogger;

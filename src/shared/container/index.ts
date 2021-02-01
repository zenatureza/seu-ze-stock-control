import { container } from 'tsyringe';

import './providers';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import CheckProductsAvailabilityService from '@modules/products/services/CheckProductsAvailabilityService';
import UpdateProductsQuantitiesInStockService from '@modules/products/services/UpdateProductsQuantitiesInStockService';
import StockServiceLogger from '@shared/infra/logs/StockServiceLogger';
import StockServiceLogsRepository from '@modules/products/infra/typeorm/repositories/StockServiceLogsRepository';

container.registerSingleton<StockServiceLogger>(
  'StockServiceLogger',
  StockServiceLogger,
);

container.registerSingleton<CheckProductsAvailabilityService>(
  'CheckProductsAvailabilityService',
  CheckProductsAvailabilityService,
);

container.registerSingleton<UpdateProductsQuantitiesInStockService>(
  'UpdateProductsQuantitiesInStockService',
  UpdateProductsQuantitiesInStockService,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<StockServiceLogsRepository>(
  'StockServiceLogsRepository',
  StockServiceLogsRepository,
);

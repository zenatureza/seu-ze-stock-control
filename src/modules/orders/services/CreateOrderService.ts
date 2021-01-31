import { inject, injectable } from 'tsyringe';

import ICreateOrderProductDTO from '../dtos/ICreateOrderProductDTO';
import Order from '../infra/typeorm/schemas/Order.schema';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import CheckProductsAvailabilityService from '@modules/products/services/CheckProductsAvailabilityService';
import IGetProductFromStockDTO from '@modules/products/dtos/IGetProductFromStockDTO';
import AppError from '@shared/errors/AppError';
import getOrderTotalPrice from './GetOrderTotalPriceService';
import UpdateProductsQuantitiesInStockService from '@modules/products/services/UpdateProductsQuantitiesInStockService';

interface IRequest {
  products: ICreateOrderProductDTO[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CheckProductsAvailabilityService')
    private checkProductsAvailabilityService: CheckProductsAvailabilityService,

    @inject('UpdateProductsQuantitiesInStockService')
    private updateProductsQuantitiesInStockService: UpdateProductsQuantitiesInStockService,
  ) {}
  public async execute({ products }: IRequest): Promise<Order> {
    const availableProducts:
      | IGetProductFromStockDTO[]
      | undefined = await this.checkProductsAvailabilityService.execute(
      products,
    );

    if (!availableProducts) {
      throw new AppError(
        'The order could not be made because the products are unavailable.',
      );
    }

    try {
      const order = await this.ordersRepository.create({
        products,
        total: getOrderTotalPrice(availableProducts),
      });

      // after creating the order, should update all products quantites
      await this.updateProductsQuantitiesInStockService.execute(products);

      return order;
    } catch (error) {
      console.log(error);
      throw new AppError('Sorry, but an unexpected error occurred.', 500);
    }
  }
}

export default CreateOrderService;

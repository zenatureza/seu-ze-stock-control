import { container, inject, injectable } from 'tsyringe';

import ICreateOrderProductDTO from '../dtos/ICreateOrderProductDTO';
import Order from '../infra/typeorm/schemas/Order.schema';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import CheckProductsAvailabilityService from '@modules/products/services/CheckProductsAvailabilityService';
import IGetProductFromStockDTO from '@modules/products/dtos/IGetProductFromStockDTO';
import AppError from '@shared/errors/AppError';
import getOrderTotalPrice from './GetOrderTotalPriceService';
import UpdateProductsQuantitiesInStockService from '@modules/products/services/UpdateProductsQuantitiesInStockService';
import IGetOrderDTO from '../dtos/IGetOrderDTO';

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
  public async execute({
    products: orderProdcts,
  }: IRequest): Promise<IGetOrderDTO> {
    const availableProducts: IGetProductFromStockDTO[] = await this.checkProductsAvailabilityService.execute(
      orderProdcts,
    );

    // creates the order itself
    const createdOrder = await this.ordersRepository.create({
      // products,
      products: availableProducts.map(ap => {
        const orderProduct = orderProdcts.find(
          op => op.name === ap.name,
        ) as any;

        return {
          name: ap.name,
          price: ap.price,
          quantity: orderProduct.quantity,
        };
      }),
      total: getOrderTotalPrice(
        availableProducts.map(p => {
          return [p.quantity, p.price];
        }),
      ),
    });

    // after creating the order, should update all products quantites
    await this.updateProductsQuantitiesInStockService.execute(orderProdcts);

    const orderDTO: IGetOrderDTO = {
      id: createdOrder.id.toString(),
      products: orderProdcts.map(p => {
        const orderProduct = createdOrder.products.find(
          product => product.name === p.name,
        ) as any;

        return {
          name: p.name,
          quantity: p.quantity,
          price: orderProduct.price,
        };
      }),
      total: createdOrder.getTotal(),
    };

    return orderDTO;
  }
}

export default CreateOrderService;

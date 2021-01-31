import { json, Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import IGetOrderDTO from '@modules/orders/dtos/IGetOrderDTO';
import GetOrderService from '@modules/orders/services/GetOrderService';

export default class OrdersControllers {
  // TODO: Split in 2 methods

  // [GET] /orders
  // [GET] /orders/:id
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    if (id) {
      const service = container.resolve(GetOrderService);

      const order = await service.execute(id);
      return response.json(order);
    }

    // TODO: should paginate?
    return response.json();
  }

  // [POST] /orders
  public async create(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;

    const service = container.resolve(CreateOrderService);
    const createdOrder = await service.execute({
      products,
    });

    // Success...
    return response.json(createdOrder);
  }
}

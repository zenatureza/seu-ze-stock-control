import { json, Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';

export default class OrdersControllers {
  // TODO: Split in 2 methods
  // /:id?
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    if (id) {
      return response.json({
        id: '456',
        products: [
          {
            name: 'Coffee',
            quantity: 3,
            price: 2.43,
          },
        ],
        total: 7.29,
      });
    }

    return response.json({
      orders: [
        {
          id: '123',
          products: [
            {
              name: 'Watermelon',
              quantity: 2,
              price: 5.47,
            },
          ],
          total: 10.94,
        },
      ],
    });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;

    const service = container.resolve(CreateOrderService);
    const createdOrder = await service.execute({
      products,
    });

    // const createdOrder = {
    //   id: '42',
    //   products: [
    //     {
    //       name: 'Kiwi',
    //       quantity: 1,
    //       price: 9.21,
    //     },
    //   ],
    //   total: 9.21,
    // };

    // Success...
    return response.json(createdOrder);
  }
}

import { Request, Response } from 'express';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    // TODO: getFromDatabase

    return response.json({
      products: [{ name, price: 10.5, quantity: 10 }],
    });
  }
}

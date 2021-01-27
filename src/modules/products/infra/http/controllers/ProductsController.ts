import { Request, Response } from 'express';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({ products: [ { name: 'Tea', price: 10.50, quantity: 10 } ] });
  }
}

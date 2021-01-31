import GetProductFromStockService from '@modules/products/services/GetProductFromStockService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  // [GET] /products/:name
  public async index(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const service = container.resolve(GetProductFromStockService);
    const product = await service.execute(name);

    return response.json(product);
  }
}

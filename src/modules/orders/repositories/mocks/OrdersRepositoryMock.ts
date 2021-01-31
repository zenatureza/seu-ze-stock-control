import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Product from '@modules/products/infra/typeorm/schemas/Product.schema';
import Order from '@modules/orders/infra/typeorm/schemas/Order.schema';
import { ObjectID } from 'mongodb';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import getOrderTotalPrice from '@modules/orders/services/GetOrderTotalPriceService';

class OrdersRepositoryMock implements IOrdersRepository {
  private products: Product[] = [];

  constructor(products?: ICreateOrderProductDTO[]) {
    products?.forEach(productDto => {
      const product = new Product(productDto.name, productDto.quantity);
      Object.assign(product, {
        id: new ObjectID(),
        price: productDto.price,
        name: productDto.name,
      });
      this.products.push(product);
    });
  }

  public async create({ products, total }: ICreateOrderDTO): Promise<Order> {
    products.forEach(p => {
      const product = new Product(p.name, p.quantity);

      this.products.push(product);
    });

    const order = new Order();

    Object.assign(order, {
      id: new ObjectID(),
      total,
      products: this.products,
      created_at: Date.now,
    });

    return order;
  }

  public async get(id: string): Promise<Order> {
    const order = new Order();

    Object.assign(order, {
      id: id,
      products: this.products,
      total: getOrderTotalPrice(
        this.products.map(p => {
          return {
            name: p.name,
            price: p.price,
            quantity: p.quantity,
          };
        }),
      ),
    });

    return order;
  }
}

export default OrdersRepositoryMock;

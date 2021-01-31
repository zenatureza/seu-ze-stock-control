import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Product from '@modules/products/infra/typeorm/schemas/Product.schema';
import Order from '@modules/orders/infra/typeorm/schemas/Order.schema';
import { ObjectID } from 'mongodb';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import getOrderTotalPrice from '@modules/orders/services/GetOrderTotalPriceService';
import IGetOrderDTO from '@modules/orders/dtos/IGetOrderDTO';

class OrdersRepositoryMock implements IOrdersRepository {
  private products: Product[] = [];
  private orders: Order[] = [];

  constructor(products?: ICreateOrderProductDTO[], orders?: IGetOrderDTO[]) {
    products?.forEach(productDto => {
      const product = new Product(productDto.name, productDto.quantity);
      Object.assign(product, {
        id: new ObjectID(),
        price: productDto.price,
        name: productDto.name,
      });
      this.products.push(product);
    });

    orders?.forEach(orderDto => {
      const order = new Order();

      Object.assign(order, {
        id: new ObjectID(),
        products: orderDto.products.map(p => {
          return {
            id: new ObjectID(),
            price: p.price,
            name: p.name,
            quantity: p.quantity,
          };
        }),
        total: getOrderTotalPrice(
          orderDto.products.map(x => {
            return [x.quantity, x.price];
          }),
        ),
      });

      this.orders.push(order);
    });
  }

  public async create({ products, total }: ICreateOrderDTO): Promise<Order> {
    products.forEach(p => {
      const product = new Product(p.name, p.quantity);

      product.price = p.price;

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
          return [p.quantity, p.price];
        }),
      ),
    });

    return order;
  }

  public async getPaged(page: number): Promise<Order[] | undefined> {
    return this.orders;
  }
}

export default OrdersRepositoryMock;

import IGetProductFromStockDTO from '@modules/products/dtos/IGetProductFromStockDTO';
import getOrderTotalPrice from './GetOrderTotalPriceService';

describe('getOrderTotalPrice', () => {
  it('should return correct total price', () => {
    const orderProducts: IGetProductFromStockDTO[] = [];

    const garlic = {
      price: 10,
      quantity: 1,
    };
    const kiwi = {
      price: 5,
      quantity: 2,
    };

    orderProducts.push({
      name: 'Garlic',
      price: garlic.price,
      quantity: garlic.quantity,
    });
    orderProducts.push({
      name: 'Kiwi',
      price: kiwi.price,
      quantity: kiwi.quantity,
    });

    const totalPrice = getOrderTotalPrice(
      orderProducts.map(item => {
        return [item.quantity, item.price];
      }),
    );

    expect(totalPrice).toBe(
      garlic.price * garlic.quantity + garlic.price * garlic.quantity,
    );
  });
});

import IGetProductFromStockDTO from '@modules/products/dtos/IGetProductFromStockDTO';

export default function getOrderTotalPrice(
  products: IGetProductFromStockDTO[],
) {
  let total = 0;

  products.forEach(product => {
    total += product.price * product.quantity;
  });

  return total;
}

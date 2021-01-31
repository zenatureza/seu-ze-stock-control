export default function getProductUpdatedQuantity(
  currentQuantity: number,
  orderQuantity: number,
) {
  return Math.abs(currentQuantity - (orderQuantity ?? 0));
}

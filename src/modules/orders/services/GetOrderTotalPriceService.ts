export default function getOrderTotalPrice(
  quantitiesXPrices: [number, number][],
) {
  let total = 0;

  quantitiesXPrices.forEach(item => {
    // total += quantity * price
    total += item[0] * item[1];
  });

  return total;
}

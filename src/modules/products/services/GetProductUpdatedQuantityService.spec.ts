import getProductUpdatedQuantity from './GetProductUpdatedQuantityService';

describe('GetProductUpdatedQuantityService', () => {
  it('should never return a negative value', () => {
    const result = getProductUpdatedQuantity(1, 2);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

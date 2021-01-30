import Product from '../infra/typeorm/schemas/Product';

export default interface IProductsRepository {
  findByName(productName: string): Promise<Product | undefined>;
  save(product: Product): Promise<Product>;
}

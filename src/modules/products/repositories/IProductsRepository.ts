import Product from '../infra/typeorm/schemas/Product.schema';

export default interface IProductsRepository {
  findByName(productName: string): Promise<Product | undefined>;
  findByNames(productsNames: string[]): Promise<Product[] | undefined>;
  save(product: Product): Promise<Product>;
  saveAll(products: Product[]): Promise<Product[]>;
}

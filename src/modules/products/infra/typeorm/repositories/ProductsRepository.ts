import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Product from '../schemas/Product';

class ProductsRepository implements IProductsRepository {
  private ormRepository: MongoRepository<Product>;

  constructor() {
    this.ormRepository = getMongoRepository(Product);
  }

  public async findByName(productName: string): Promise<Product | undefined> {
    return await this.ormRepository.findOne({
      where: {
        name: productName,
      },
    });
  }

  public async save(product: Product): Promise<Product> {
    return await this.ormRepository.save(product);
  }
}

export default ProductsRepository;

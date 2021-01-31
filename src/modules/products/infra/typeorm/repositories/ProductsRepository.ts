import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import { getMongoRepository, In, MongoRepository } from 'typeorm';
import Product from '../schemas/Product.schema';

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

  public async findByNames(
    productsNames: string[],
  ): Promise<Product[] | undefined> {
    return await this.ormRepository.find({
      where: {
        name: {
          $in: productsNames,
        },
      },
    });
  }

  public async save(product: Product): Promise<Product> {
    return await this.ormRepository.save(product);
  }

  public async saveAll(products: Product[]): Promise<Product[]> {
    return await this.ormRepository.save(products);
  }
}

export default ProductsRepository;

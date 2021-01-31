import IGetProductFromStockDTO from '@modules/products/dtos/IGetProductFromStockDTO';
import Product from '@modules/products/infra/typeorm/schemas/Product.schema';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

import { ObjectID } from 'mongodb';

class ProductsRepositoryMock implements IProductsRepository {
  private products: Product[] = [];

  constructor(products?: IGetProductFromStockDTO[]) {
    products?.forEach(productDto => {
      const product = new Product(productDto.name, productDto.quantity);
      Object.assign(product, {
        id: new ObjectID(),
        price: productDto.price,
      });
      this.products.push(product);
    });
  }

  public async findByName(productName: string): Promise<Product | undefined> {
    const product = new Product(
      productName,
      this.products.find(p => p.name)?.quantity ?? 10,
    );

    Object.assign(product, {
      id: new ObjectID(),
      name: productName,
    });

    return product;
  }

  public async findByNames(
    productsNames: string[],
  ): Promise<Product[] | undefined> {
    // productsNames.forEach(productName => {
    //   this.products.push(
    //     new Product(
    //       productName,
    //       this.products.find(p => p.name)?.quantity ?? 10,
    //     ),
    //   );
    // });

    return this.products;
  }

  public async save(product: Product): Promise<Product> {
    const updatedProduct = new Product(product.name, product.quantity);

    Object.assign(product, {
      id: new ObjectID(),
      price: product.price,
      created_at: product.created_at,
      updated_at: Date.now,
    });

    return updatedProduct;
  }

  public async saveAll(products: Product[]): Promise<Product[]> {
    const updatedProducts: Product[] = [];

    products.forEach(product => {
      updatedProducts.push(new Product(product.name, product.quantity));

      Object.assign(product, {
        id: new ObjectID(),
        price: product.price,
        created_at: product.created_at,
        updated_at: Date.now,
      });
    });

    return updatedProducts;
  }
}

export default ProductsRepositoryMock;

import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService
  ) { }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    try {
      const user: Awaited<Promise<User>> = await this.userService.findOne(createProductInput.user);
      const product = this.productRepository.create({ ...createProductInput, user });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        relations: {
          user: true,
        }
      })
      return products;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product: Awaited<Promise<Product>> = await this.productRepository.findOne({
        where: {
          id
        },
        relations: ['user']
      });
      if (!product) throw new CustomGraphQLException("This product does not exists.", httpStatusCodes['Not Found'], GraphQLErrorCodes['NOT_FOUND']);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async update(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    try {
      const product = await this.productRepository.update({
        id
      }, updateProductInput);

      if (product?.affected === 0) throw new CustomGraphQLException('This product does not exists.', httpStatusCodes['Not Found'], GraphQLErrorCodes['NOT_FOUND']);

      const updatedProduct: Awaited<Promise<Product>> = await this.findOne(id);
      return updatedProduct;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      const product: Awaited<Promise<Product>> = await this.findOne(id);
      const deletedProduct = await this.productRepository.delete(id);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

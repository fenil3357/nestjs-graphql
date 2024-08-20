import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @Mutation(() => Product)
  async createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    try {
      const product: Awaited<Promise<Product>> = await this.productService.create(createProductInput);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => [Product], { name: 'products' })
  async findAll() {
    try {
      const products: Awaited<Promise<Product[]>> = await this.productService.findAll();
      return products;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const product: Awaited<Promise<Product>> = await this.productService.findOne(id);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => Product)
  async updateProduct(@Args('id', { type: () => ID }) id: number, @Args('updateProductInput') updateProductInput: UpdateProductInput) {
    try {
      const updatedProduct: Awaited<Promise<Product>> = await this.productService.update(id, updateProductInput);
      return updatedProduct;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => Product)
  async removeProduct(@Args('id', { type: () => Int }) id: number) {
    try {
      const deletedProduct: Awaited<Promise<Product>> = await this.productService.remove(id);
      return deletedProduct;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

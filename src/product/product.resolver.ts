import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Context() context,
    @Args('createProductInput') createProductInput: CreateProductInput) {
    try {
      const { id } = context?.req?.user;
      const product: Awaited<Promise<Product>> = await this.productService.create(createProductInput, id);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => [Product], { name: 'products' })
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const products: Awaited<Promise<Product[]>> = await this.productService.findAll();
      return products;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => Product, { name: 'product' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const product: Awaited<Promise<Product>> = await this.productService.findOne(id);
      return product;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Context() context,
    @Args('id', { type: () => ID }) id: number, @Args('updateProductInput') updateProductInput: UpdateProductInput) {
    try {
      const { id: user_id } = context?.req?.user;
      const updatedProduct: Awaited<Promise<Product>> = await this.productService.update(id, user_id, updateProductInput);
      return updatedProduct;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)  
  async removeProduct(
    @Context() context,
    @Args('id', { type: () => Int }) id: number) {
    try {
      const { id: user_id } = context?.req?.user;
      const deletedProduct: Awaited<Promise<Product>> = await this.productService.remove(id, user_id);
      return deletedProduct;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

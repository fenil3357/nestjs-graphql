import { InputType, Int, Field, Float, ID } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ProductCategoryType } from '../types/enum/category.enum.types';

@InputType()
export class CreateProductInput {
  @IsString()
  @Field()
  name: string;

  @IsNumber()
  @Min(0)
  @Field(type => Float)
  price: number;

  @IsEnum(ProductCategoryType, { message: 'Invalid product category' })
  @Field()
  category: ProductCategoryType;

  @IsNumber()
  @Field(type => ID)
  user: number;
}

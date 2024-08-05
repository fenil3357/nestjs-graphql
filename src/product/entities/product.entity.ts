import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductCategoryType } from '../types/enum/category.enum.types';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  price: number;

  @Column({ type: 'enum', enum: ProductCategoryType })
  @Field()
  category: ProductCategoryType;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt: Date;
}

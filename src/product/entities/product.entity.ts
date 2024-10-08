import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductCategoryType } from '../types/enum/category.enum.types';
import { User } from 'src/user/entities/user.entity';

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

  @ManyToOne((type) => User, (user) => user.products, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @Field(type => User)
  @JoinColumn()
  user: User;

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

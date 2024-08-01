import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoleType } from '../types/enum/user.enum.types';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column({ unique: true, update: false, nullable: false })
  @Field()
  email: string;

  @Column({ select: false })
  @Field({ nullable: true })
  password: string;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  dob?: Date;

  @Column({ type: 'enum', enum: UserRoleType })
  @Field()
  role: UserRoleType;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  @Field()
  deletedAt: Date;
}
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserGenderType, UserRoleType } from '../types/enum/user.enum.types';

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

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  dob?: Date;

  @Column({ type: 'enum', enum: UserRoleType })
  @Field()
  role: UserRoleType;

  @Column(({ type: 'enum', enum: UserGenderType }))
  @Field()
  gender: UserGenderType;

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
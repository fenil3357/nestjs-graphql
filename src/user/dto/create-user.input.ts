import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { UserGenderType, UserRoleType } from '../types/enum/user.enum.types';

@InputType()
export class CreateUserInput {
  @IsString()
  @Field()
  username: string;

  @IsEmail(undefined, { message: 'Invalid email' })
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  @IsOptional()
  @IsDate()
  // @Transform(({ value }) => new Date(value))
  @Field({ nullable: true })
  dob?: Date;

  @IsEnum(UserGenderType, { message: 'Invalid gender type' })
  @Field()
  gender: UserGenderType;

  @IsEnum(UserRoleType, { message: 'Invalid role' })
  @Field()
  role: UserRoleType;
}

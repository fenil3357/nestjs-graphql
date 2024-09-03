import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      const user = await this.userService.create(createUserInput);
      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Context() context) {
    try {
      const { id } = context?.req?.user;
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(@Context() context, @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    try {
      const { id } = context?.req?.user;
      const user = await this.userService.update(id, updateUserInput);
      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Context() context) {
    try {
      const { id } = context?.req?.user;
      const user = await this.userService.remove(id);
      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthUserInput } from './dto/authenticate-user.input';
import { User } from 'src/user/entities/user.entity';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { GraphqlLoginResponse } from './types/auth.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => GraphqlLoginResponse)
  async login(@Args('AuthUserInput') authUserInput: AuthUserInput) {
    try {
      const data = await this.authService.authenticate(authUserInput);
      return data;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

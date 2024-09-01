import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { DECODED_USER_TYPE, LOGIN_RESPONSE_TYPE, Tokens } from './types/auth.types';
import { AuthUserInput } from './dto/authenticate-user.input';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/helpers/encryption';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async authenticate(authUser: AuthUserInput): Promise<LOGIN_RESPONSE_TYPE> {
    try {
      const { email, password } = authUser;

      const user: Awaited<User> = await this.userService.findSingleUser({
        email
      }, ['id', 'role', 'email', 'password']);

      // Validate the password
      const valid: Awaited<boolean> = await comparePassword(password, user.password);

      if (!valid) throw new CustomGraphQLException('Incorrect password.', httpStatusCodes['Unauthorized'], GraphQLErrorCodes['UNAUTHORIZED']);

      // Sign tokens
      const tokens: Awaited<Tokens> = await this.signToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const userData: Awaited<User> = await this.userService.findSingleUser({
        email
      })

      return {
        user: userData,
        tokens
      };
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }

  async signToken(decoded: DECODED_USER_TYPE): Promise<Tokens> {
    try {
      const accessToken: string = this.jwtService.sign(decoded);
      const refreshToken: string = this.jwtService.sign(decoded);

      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }

  async verifyToken(token: string): Promise<DECODED_USER_TYPE> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }
}

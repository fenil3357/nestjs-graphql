import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV_VALUE } from 'src/config/config';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { DECODED_USER_TYPE } from './types/auth.types';
import { AuthUserInput } from './dto/authenticate-user.input';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/helpers/encryption';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async authenticate(authUser: AuthUserInput) {
    try {
      const { email, password } = authUser;

      const user = await this.userService.findSingleUser({
        email
      }, ['id', 'email', 'password', 'role']);

      // Validate the password
      const valid = comparePassword(password, user.password);

      if (!valid) throw new CustomGraphQLException('Invalid password', httpStatusCodes['Unauthorized'], GraphQLErrorCodes['UNAUTHORIZED']);

      // Sign tokens
      const tokens = await this.signToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return tokens;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }

  async signToken(decoded: DECODED_USER_TYPE): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    try {
      const accessToken = this.jwtService.sign(JSON.stringify(decoded));
      const refreshToken = this.jwtService.sign(JSON.stringify(decoded));

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

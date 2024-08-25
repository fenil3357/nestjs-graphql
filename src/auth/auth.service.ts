import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV_VALUE } from 'src/config/config';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';
import { httpStatusCodes } from 'src/utils/responseConfig';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: ENV_VALUE.JWT_SECRET
      });
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }
}

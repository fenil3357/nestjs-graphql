import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CustomGraphQLException, GraphQLErrorCodes } from "src/utils/graphqlErrorResponse";
import { httpStatusCodes } from "src/utils/responseConfig";
import { DECODED_USER_TYPE } from "../types/auth.types";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;

      const authHeader = req?.headers?.authorization;

      if (!authHeader) throw new CustomGraphQLException(
        'Authorization header is missing.',
        httpStatusCodes['Unauthorized'],
        GraphQLErrorCodes['UNAUTHORIZED']
      )

      const token = authHeader.split(' ')[1];

      if (!token) throw new CustomGraphQLException(
        'Token is not provided.',
        httpStatusCodes['Unauthorized'],
        GraphQLErrorCodes['UNAUTHORIZED']
      )

      const decoded: DECODED_USER_TYPE = await this.authService.verifyToken(token);

      // Check if user exists
      const user: User = await this.userService.findOne(decoded.id);

      if (!user) throw new CustomGraphQLException(
        'This user does not exists.',
        httpStatusCodes['Unauthorized'],
        GraphQLErrorCodes['UNAUTHORIZED']
      )

      req.user = decoded;
      return true;
    } catch (error) {
      throw new CustomGraphQLException(error.message, httpStatusCodes['Unauthorized'], GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }
}
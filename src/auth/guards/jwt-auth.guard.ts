import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CustomGraphQLException, GraphQLErrorCodes } from "src/utils/graphqlErrorResponse";
import { httpStatusCodes } from "src/utils/responseConfig";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;

      const authHeader = req?.headers?.authorization;

      if (!authHeader) throw new UnauthorizedException('Authorization header missing.');

      const token = authHeader.split(' ')[1];

      if (!token) throw new UnauthorizedException('Token is missing.');

      const decoded = await this.authService.verifyToken(token);
      req.user = decoded;
      return true;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Unauthorized'], error?.extensions?.code || GraphQLErrorCodes['UNAUTHORIZED']);
    }
  }
}
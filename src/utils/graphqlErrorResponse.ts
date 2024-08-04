import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export class CustomGraphQLException extends GraphQLError {
  constructor(message: string, status: HttpStatus, code: GraphQLErrorCodeType) {
    super(message, {
      extensions: {
        code,
        status
      }
    });
  }
}

export const GraphQLErrorCodes = {
  // Client Errors (4xx)
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  NOT_ACCEPTABLE: 'NOT_ACCEPTABLE',
  CONFLICT: 'CONFLICT',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  BAD_GATEWAY: 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT'
};

export type GraphQLErrorCodeType = typeof GraphQLErrorCodes[keyof typeof GraphQLErrorCodes];
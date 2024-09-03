import { Field, ObjectType } from "@nestjs/graphql"
import { User } from "src/user/entities/user.entity"

export type DECODED_USER_TYPE = {
  id: number,
  email: string,
  role: string
}

export type LOGIN_RESPONSE_TYPE = {
  user: User,
  tokens: {
    accessToken: string,
    refreshToken: string
  }
}

@ObjectType()
export class Tokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class GraphqlLoginResponse {
  @Field()
  user: User;

  @Field()
  tokens: Tokens;
}
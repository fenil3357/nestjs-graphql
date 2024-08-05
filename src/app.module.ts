import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { httpStatusCodes } from './utils/responseConfig';
import { GraphQLErrorCodes } from './utils/graphqlErrorResponse';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error) => {
        return {
          message: error.message,
          code: error?.extensions?.code || GraphQLErrorCodes['INTERNAL_SERVER_ERROR'],
          httpStatusCode: error?.extensions?.status || httpStatusCodes['Internal Server Error']
        }
      },
    }),
    DatabaseModule,
    UserModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_VALUE } from './config/config';
import { CustomLogger } from './utils/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger()
  });
  await app.listen(ENV_VALUE.SERVER_PORT);
  console.log(`Server is running or http://localhost:${ENV_VALUE.SERVER_PORT}`);
}
bootstrap();

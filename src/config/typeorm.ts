import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV_VALUE } from './config';

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: ENV_VALUE.DB_HOST,
  port: ENV_VALUE.DB_PORT,
  username: ENV_VALUE.DB_USERNAME,
  password: ENV_VALUE.DB_PASSWORD,
  database: ENV_VALUE.DB_NAME,
  synchronize: false, // synchronize: true shouldn't be used in production, otherwise you can lose production data
  // use migration to make changes in DB
  logging: false,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/migration/*{.ts,.js}'],
  subscribers: [],
};

export const AppDataSource = new DataSource(TypeORMConfig as DataSourceOptions);

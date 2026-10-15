import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  autoLoadEntities: true,

  synchronize: false, // set to false in production

  logging: true,
});
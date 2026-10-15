import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 5432),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  ssl: {
    rejectUnauthorized: true,
  },

  extra: {
    ssl: {
      rejectUnauthorized: true,
    },
  },

  autoLoadEntities: true,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
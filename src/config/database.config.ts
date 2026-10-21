import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseProfile } from './database-profile';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const profile = getDatabaseProfile();
  const ssl = profile === 'local' ? false : { rejectUnauthorized: true };

  return {
    type: 'postgres',

    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT || 5432),

    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    ssl,

    extra: {
      ssl,
    },

    autoLoadEntities: true,
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
  };
};

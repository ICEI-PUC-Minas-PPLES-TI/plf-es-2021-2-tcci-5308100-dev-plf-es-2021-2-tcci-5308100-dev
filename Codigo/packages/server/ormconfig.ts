import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const getPath = (config: 'entities' | 'migrations') => {
  if (config === 'entities' && process.env.NODE_ENV === 'MIGRATION')
    return join(__dirname, '**', '*.entity.{ts, js}');

  if (config === 'entities' && process.env.NODE_ENV !== 'MIGRATION')
    return join(__dirname, '**', '*.entity.{ts}');

  if (config === 'migrations' && process.env.NODE_ENV === 'MIGRATION')
    return __dirname + '/src/database/migrations/**/*{.ts, .js}';

  if (config === 'migrations' && process.env.NODE_ENV !== 'MIGRATION')
    return __dirname + '/src/database/migrations/**/*{.ts}';
};

export const config: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  entities: [getPath('entities')],
  migrations: [getPath('migrations')],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/entities/Models',
    subscribersDir: 'src/entities/Subscribers',
  },
};

import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { UtilsModule } from './utils/utils.module';
import { ShopifyModule } from './shopify/shopify.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

@Module({
  imports: [
    ApiModule,
    AuthenticationModule,
    DatabaseModule,
    EmailModule,
    FilesModule,
    UtilsModule,
    ShopifyModule,
    ServeStaticModule.forRoot({
      rootPath: join(resolve(), 'public/app-web'),
      exclude: ['/api*'],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'warn',
          dirname: 'logs',
        }),
        new winston.transports.Console({
          silent: process.env.NODE_ENV === 'production',
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('SEC Server', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  ],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { RequestMethod } from '@nestjs/common';
import { ForbiddenExceptionFilter } from './utils/forbidden-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  // app.use(requestContextMiddleware);
  // app.enableCors({ origin: process.env.ORIGIN_URL });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.useGlobalFilters(new ForbiddenExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

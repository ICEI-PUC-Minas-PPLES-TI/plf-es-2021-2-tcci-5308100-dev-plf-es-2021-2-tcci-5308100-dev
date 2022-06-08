import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import { ApiResponse } from '@sec/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const body: ApiResponse<any> = {
      status: 'FAIL',
      message: 'Infelizmente você não tem permissão para acessar esse recurso',
      payload: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    };

    response.status(status).json(body);
  }
}

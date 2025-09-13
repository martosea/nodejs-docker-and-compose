import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter<BadRequestException> {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = exception.getResponse() as
      | string
      | { message: string | string[]; error: string; statusCode: number };

    response.status(exception.getStatus()).json({
      message: 'Ошибка валидации',
      status: exception.getStatus(),
      errors: errorResponse,
    });
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status = this.getStatus(exception);
    const responseBody = this.buildResponse(exception, status);

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private getStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildResponse(exception: unknown, status: number) {
    if (exception instanceof HttpException) {
      return { message: exception.message, status };
    }
    return {
      message:
        'Ошибка сервера. Пожалуйста, повторите попытку позже или свяжитесь с нами',
      status,
    };
  }
}

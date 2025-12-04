import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * 全局异常过滤器
 * 捕获所有异常并统一返回格式
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const showDetail =
      (process.env.ERROR_FULL ?? 'true').toLowerCase() === 'true';
    const messageResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;

    // 处理字符串或对象类型的错误信息，并在开发环境尽可能透出异常细节
    let msg: string;
    if (typeof messageResponse === 'string') {
      msg = messageResponse;
    } else if (
      typeof messageResponse === 'object' &&
      messageResponse !== null &&
      'message' in (messageResponse as Record<string, unknown>)
    ) {
      const m = (messageResponse as { message: unknown }).message;
      if (Array.isArray(m)) {
        msg = m
          .map((x) => (typeof x === 'string' ? x : JSON.stringify(x)))
          .join(', ');
      } else if (typeof m === 'string') {
        msg = m;
      } else if (typeof m === 'number' || typeof m === 'boolean') {
        msg = String(m);
      } else if (m && typeof m === 'object') {
        try {
          msg = JSON.stringify(m);
        } catch {
          msg = 'Internal Server Error';
        }
      } else {
        msg = 'Internal Server Error';
      }
    } else if (messageResponse && typeof messageResponse === 'object') {
      try {
        msg = JSON.stringify(messageResponse);
      } catch {
        msg = 'Internal Server Error';
      }
    } else {
      msg = 'Internal Server Error';
    }

    console.error('[AllExceptionsFilter]', exception);
    const err = exception as { name?: string; stack?: string };
    const errorDetail = showDetail
      ? {
          name: typeof err?.name === 'string' ? err.name : undefined,
          stack: typeof err?.stack === 'string' ? err.stack : undefined,
          response:
            typeof messageResponse === 'object' && messageResponse !== null
              ? messageResponse
              : undefined,
        }
      : undefined;

    response.status(status).json({
      code: status,
      msg: msg,
      data: null,
      error: errorDetail,
    });
  }
}

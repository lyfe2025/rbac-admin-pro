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

    const messageResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    // 处理字符串或对象类型的错误信息
    let msg: string;
    if (typeof messageResponse === 'string') {
      msg = messageResponse;
    } else if (
      typeof messageResponse === 'object' &&
      messageResponse !== null &&
      'message' in messageResponse
    ) {
      // 安全地访问 message 属性
      const errorObj = messageResponse as { message: string | string[] };
      if (Array.isArray(errorObj.message)) {
        msg = errorObj.message.join(', ');
      } else {
        msg = errorObj.message;
      }
    } else {
      msg = 'Internal Server Error';
    }

    response.status(status).json({
      code: status,
      msg: msg,
      data: null,
    });
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;

    const logLabel = `[${method.toUpperCase()}] ${originalUrl}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
  }
}

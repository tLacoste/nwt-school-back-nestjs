import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { FastifyReply } from 'fastify';

@Injectable()
export class PeopleInterceptor implements NestInterceptor {
  /**
   * Class constructor
   * @param _logger
   */
  constructor(private readonly _logger: Logger) {
  }

  /**
   * Intercepts all HTTP requests and responses
   *
   * @param context
   * @param next
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cls = context.getClass();
    const handler = context.getHandler();
    const response: FastifyReply = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle()
      .pipe(
        map(_ => of(_)),
        mergeMap((obs: Observable<any>) =>
          merge(
            obs
              .pipe(
                filter(_ => !!_),
                map(_ => _),
              ),
            obs
              .pipe(
                filter(_ => !_),
                tap(_ => response.status(204)),
                map(_ => _),
              ),
          )),
        tap(_ => this._logger.log(!!_ ? _ : 'NO CONTENT', `PeopleInterceptor => ${cls.name}.${handler.name}`)),
      );
  }
}

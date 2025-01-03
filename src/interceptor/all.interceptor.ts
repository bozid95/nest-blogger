import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Response<T> {
  data: T;
}

/**
 * Merubah format response supaya seragam dengan menambahkan logging dan log error termasuk pesan validasi
 */
@Injectable()
export class AllInOneInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger(AllInOneInterceptor.name); // Logger untuk interceptor ini

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Log request details
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    this.logger.log(`Handling ${method} request for ${url}`);

    return next.handle().pipe(
      map((data) => {
        // Log the response data before sending it back
        this.logger.log(
          `Response data for ${method} request to ${url}: ${JSON.stringify(data)}`,
        );

        // Transform the response
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data?.message ?? 'Success',
          data: data?.data ?? data,
          meta: data?.meta, // for pagination
        };
      }),
      catchError((error) => {
        // Handle validation errors
        if (error instanceof BadRequestException) {
          this.logger.error(
            `Validation Error occurred during ${request.method} request to ${request.url}: ${error.message}`,
          );

          // Capture validation errors (e.g., failed field validation)
          const response = error.getResponse(); // Using getResponse() to access error details
          if (response && (response as any).message) {
            this.logger.error(
              `Validation details: ${JSON.stringify((response as any).message)}`,
            );
          }
        } else if (error instanceof HttpException) {
          // Handle other HttpException errors
          this.logger.error(
            `HttpException occurred during ${request.method} request to ${request.url}: ${error.message}`,
          );
        } else {
          // Log general error
          this.logger.error(
            `Error occurred during ${request.method} request to ${request.url}: ${error.message}`,
          );
        }

        // Log the stack trace for debugging
        this.logger.error(`Stack trace: ${error.stack}`);

        // Rethrow the error so that it can be handled by global exception filter
        return throwError(() => error);
      }),
    );
  }
}

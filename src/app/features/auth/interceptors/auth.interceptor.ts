import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from '@features/auth/services/auth';

let refreshingTokens = false;

const refreshedAccessToken$ =
  new BehaviorSubject<string | null>(
    null,
  );

export const authInterceptor:
  HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ) => {
    const authService =
      inject(AuthService);

    const isAuthEndpoint =
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/refresh') ||
      request.url.includes('/auth/logout') ||
      request.url.includes('/auth/registro');

    const accessToken =
      authService.getAccessToken();

    const authenticatedRequest =
      !isAuthEndpoint && accessToken
        ? addAuthorizationHeader(
            request,
            accessToken,
          )
        : request;

    return next(authenticatedRequest).pipe(
      catchError(
        (
          error: HttpErrorResponse,
        ) => {
          const canRefresh =
            error.status === 401 &&
            !isAuthEndpoint &&
            Boolean(
              authService.getRefreshToken(),
            );

          if (!canRefresh) {
            return throwError(
              () => error,
            );
          }

          if (refreshingTokens) {
            return refreshedAccessToken$
              .pipe(
                filter(
                  (
                    token,
                  ): token is string =>
                    token !== null,
                ),
                take(1),
                switchMap((newAccessToken) =>
                  next(
                    addAuthorizationHeader(
                      request,
                      newAccessToken,
                    ),
                  ),
                ),
              );
          }

          refreshingTokens = true;
          refreshedAccessToken$.next(null);

          return authService
            .refreshTokens()
            .pipe(
              switchMap((response) => {
                refreshedAccessToken$.next(
                  response.accessToken,
                );

                return next(
                  addAuthorizationHeader(
                    request,
                    response.accessToken,
                  ),
                );
              }),
              catchError((refreshError) => {
                authService.clearSession();

                return throwError(
                  () => refreshError,
                );
              }),
              finalize(() => {
                refreshingTokens = false;
              }),
            );
        },
      ),
    );
  };

function addAuthorizationHeader(
  request: HttpRequest<unknown>,
  accessToken: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization:
        `Bearer ${accessToken}`,
    },
  });
}
import {
  computed,
  Injectable,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  tap,
} from 'rxjs';

import { environment } from '@environments/environment';
import {
  AuthSession,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@features/auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl =
    `${environment.apiUrl}/auth`;

  private readonly storageKey =
    'gamarra-auth-session';

  private readonly sessionSignal =
    signal<AuthSession | null>(
      this.loadSession(),
    );

  readonly session =
    this.sessionSignal.asReadonly();

  readonly user = computed(
    () => this.sessionSignal()?.usuario ?? null,
  );

  readonly isAuthenticated = computed(
    () => this.sessionSignal() !== null,
  );

  constructor(
    private readonly http: HttpClient,
  ) { }

  login(
    credentials: LoginRequest,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials,
      )
      .pipe(
        tap((response) => {
          this.saveSession({
            usuario: response.usuario,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        }),
      );
  }

  getProfile(): Observable<{
    mensaje: string;
    usuario: AuthUser;
  }> {
    return this.http.get<{
      mensaje: string;
      usuario: AuthUser;
    }>(
      `${this.apiUrl}/perfil`,
    );
  }

  refreshTokens():
    Observable<RefreshTokenResponse> {
    const refreshToken =
      this.sessionSignal()?.refreshToken;

    const request: RefreshTokenRequest = {
      refreshToken: refreshToken ?? '',
    };

    return this.http
      .post<RefreshTokenResponse>(
        `${this.apiUrl}/refresh`,
        request,
      )
      .pipe(
        tap((response) => {
          const currentSession =
            this.sessionSignal();

          if (!currentSession) {
            return;
          }

          this.saveSession({
            ...currentSession,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        }),
      );
  }

  logout(): Observable<unknown> {
    const refreshToken =
      this.sessionSignal()?.refreshToken;

    return this.http
      .post(
        `${this.apiUrl}/logout`,
        {
          refreshToken:
            refreshToken ?? '',
        },
      )
      .pipe(
        tap(() => {
          this.clearSession();
        }),
      );
  }

  getAccessToken(): string | null {
    return (
      this.sessionSignal()?.accessToken ??
      null
    );
  }

  getRefreshToken(): string | null {
    return (
      this.sessionSignal()?.refreshToken ??
      null
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.sessionSignal()?.usuario ?? null;
  }

  clearSession(): void {
    this.sessionSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private saveSession(
    session: AuthSession,
  ): void {
    this.sessionSignal.set(session);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(session),
    );
  }

  private loadSession(): AuthSession | null {
    try {
      const storedSession =
        localStorage.getItem(
          this.storageKey,
        );

      if (!storedSession) {
        return null;
      }

      return JSON.parse(
        storedSession,
      ) as AuthSession;
    } catch {
      localStorage.removeItem(
        this.storageKey,
      );

      return null;
    }
  }
}
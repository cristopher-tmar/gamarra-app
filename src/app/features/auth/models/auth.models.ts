export type UserRole =
  | 'CLIENTE'
  | 'COMERCIANTE'
  | 'ADMINISTRADOR';

export interface AuthUser {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: UserRole;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  tipoToken: 'Bearer';
  usuario: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  mensaje: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  tipoToken: 'Bearer';
}

export interface AuthSession {
  usuario: AuthUser;
  accessToken: string;
  refreshToken: string;
}
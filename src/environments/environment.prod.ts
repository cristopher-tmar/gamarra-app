import { resolveApiUrl } from './api-url';

export const environment = {
  production: true,
  // Reemplazar por la URL pública (https) del API al desplegar.
  apiUrl: resolveApiUrl(),
};

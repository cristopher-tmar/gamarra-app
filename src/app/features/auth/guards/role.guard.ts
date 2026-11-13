import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';

import {
  UserRole,
} from '../models/auth.models';
import { AuthService } from '../services/auth';

/**
 * Ruta de inicio para cada rol autenticado.
 */
export function getHomeUrlForRole(
  role: UserRole | null | undefined,
): string {
  switch (role) {
    case 'COMERCIANTE':
      return '/vendedor/inicio';

    case 'ADMINISTRADOR':
      return '/dashboard-predictivo';

    default:
      return '/mi-cuenta';
  }
}

/**
 * Restringe una ruta a los roles indicados.
 * Debe usarse después de `authGuard`.
 */
export function roleGuard(
  ...allowedRoles: UserRole[]
): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const role =
      authService.getCurrentUser()?.rol;

    if (
      role &&
      allowedRoles.includes(role)
    ) {
      return true;
    }

    return router.parseUrl(
      getHomeUrlForRole(role),
    );
  };
}

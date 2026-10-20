import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  helpCircleOutline,
  logInOutline,
  logOutOutline,
  notificationsOutline,
  personCircleOutline,
  refreshOutline,
  settingsOutline,
} from 'ionicons/icons';

import { AuthService } from '@features/auth/services/auth';
import { UiToastService } from '@shared/services/ui-toast';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonContent,
    IonIcon,
  ],
})
export class AccountPage {
  readonly user =
    this.authService.user;

  readonly isAuthenticated =
    this.authService.isAuthenticated;

  loggingOut = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly uiToast: UiToastService,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
  ) {
    addIcons({
      helpCircleOutline,
      logInOutline,
      logOutOutline,
      notificationsOutline,
      personCircleOutline,
      refreshOutline,
      settingsOutline,
    });
  }

  showVisualSearchTutorial(): void {
    localStorage.removeItem(
      'visual-search-tutorial-seen',
    );

    void this.uiToast.success(
      'El tutorial se mostrará nuevamente',
    );

    void this.router.navigate([
      '/catalogo',
    ]);
  }

  showComingSoon(
    feature: string,
  ): void {
    void this.uiToast.info(
      `${feature} estará disponible próximamente`,
    );
  }

  goToLogin(): void {
    void this.router.navigate([
      '/login',
    ]);
  }

  logout(): void {
    if (this.loggingOut) {
      return;
    }

    this.loggingOut = true;

    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.loggingOut = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          void this.uiToast.success(
            'Sesión cerrada correctamente',
          );
        },
        error: () => {
          /*
           * Aunque el API no esté disponible,
           * cerramos la sesión local para no
           * dejar al usuario atrapado.
           */
          this.authService.clearSession();

          void this.uiToast.warning(
            'La sesión se cerró en este dispositivo',
          );
        },
      });
  }

  getRoleLabel(): string {
    const role = this.user()?.rol;

    switch (role) {
      case 'ADMINISTRADOR':
        return 'Administrador';

      case 'COMERCIANTE':
        return 'Comerciante';

      case 'CLIENTE':
        return 'Cliente';

      default:
        return '';
    }
  }

  ionViewWillEnter(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.authService
      .getProfile()
      .subscribe({
        error: () => {
          this.authService.clearSession();

          void this.uiToast.warning(
            'Tu sesión expiró. Inicia sesión nuevamente.',
          );

          this.changeDetectorRef.markForCheck();
        },
      });
  }

}
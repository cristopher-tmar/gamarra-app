import {
  Component,
  computed,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  IonIcon,
  IonRouterOutlet,
} from '@ionic/angular';
import {
  addIcons,
} from 'ionicons';
import {
  alertCircleOutline,
  barChartOutline,
  gridOutline,
  homeOutline,
  logOutOutline,
  menuOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import {
  AuthService,
} from '@features/auth/services/auth';

@Component({
  selector: 'app-seller-layout',
  templateUrl:
    './seller-layout.component.html',
  styleUrls: [
    './seller-layout.component.scss',
  ],
  imports: [
    IonIcon,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
})
export class SellerLayoutComponent {
  menuOpen = false;

  readonly userName = computed(() => {
    const user = this.authService.user();

    return user
      ? `${user.nombres} ${user.apellidos}`.trim()
      : 'Vendedor';
  });

  constructor(
    private readonly router:
      Router,
    private readonly authService:
      AuthService,
  ) {
    addIcons({
      alertCircleOutline,
      barChartOutline,
      gridOutline,
      homeOutline,
      logOutOutline,
      menuOutline,
      personCircleOutline,
      shieldCheckmarkOutline,
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  goToAccount(): void {
    void this.router.navigate([
      '/mi-cuenta',
    ]);
  }

  goToCustomerApp(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }
}
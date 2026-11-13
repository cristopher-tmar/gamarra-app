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
import {
  UiBottomNavComponent,
  UiBottomNavItem,
} from '@shared/components/ui-bottom-nav/ui-bottom-nav.component';

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
    UiBottomNavComponent,
  ],
})
export class SellerLayoutComponent {
  menuOpen = false;

  readonly navigationItems:
    UiBottomNavItem[] = [
      {
        label: 'Inicio',
        icon: 'home-outline',
        route: '/vendedor/inicio',
      },
      {
        label: 'Productos',
        icon: 'grid-outline',
        route: '/vendedor/productos',
      },
      {
        label: 'Análisis',
        icon: 'bar-chart-outline',
        route: '/vendedor/dashboard',
      },
      {
        label: 'Privacidad',
        icon: 'shield-checkmark-outline',
        route: '/vendedor/consentimiento',
      },
      {
        label: 'Mi cuenta',
        icon: 'person-circle-outline',
        route: '/mi-cuenta',
      },
    ];

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
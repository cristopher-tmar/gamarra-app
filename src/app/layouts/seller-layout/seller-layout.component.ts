import {
  Component,
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

  constructor(
    private readonly router:
      Router,
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

  goToCustomerApp(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }
}
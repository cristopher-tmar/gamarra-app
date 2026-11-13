import {
  ChangeDetectorRef,
  Component,
  input,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { filter } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  heartOutline,
  homeOutline,
  personOutline,
} from 'ionicons/icons';

export interface UiBottomNavItem {
  label: string;
  icon: string;
  route: string;
  /** Marca el ítem activo solo con la ruta exacta. */
  exact?: boolean;
}

const DEFAULT_ITEMS: UiBottomNavItem[] = [
  {
    label: 'Inicio',
    icon: 'home-outline',
    route: '/catalogo',
    exact: true,
  },
  {
    label: 'Buscar',
    icon: 'camera-outline',
    route: '/busqueda-visual',
  },
  {
    label: 'Favoritos',
    icon: 'heart-outline',
    route: '/favoritos',
  },
  {
    label: 'Mi cuenta',
    icon: 'person-outline',
    route: '/mi-cuenta',
  },
];

@Component({
  selector: 'app-ui-bottom-nav',
  templateUrl: './ui-bottom-nav.component.html',
  styleUrls: ['./ui-bottom-nav.component.scss'],
  imports: [
    IonIcon,
    RouterLink,
    RouterLinkActive,
  ],
})
export class UiBottomNavComponent {
  readonly items =
    input<UiBottomNavItem[]>(DEFAULT_ITEMS);

  readonly ariaLabel =
    input('Navegación principal');

  visible = true;

  constructor(
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    addIcons({
      cameraOutline,
      heartOutline,
      homeOutline,
      personOutline,
    });

    this.updateVisibility(
      this.router.url,
    );

    this.router.events
      .pipe(
        filter(
          (
            event,
          ): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.updateVisibility(
          event.urlAfterRedirects,
        );
      });
  }

  private updateVisibility(
    url: string,
  ): void {
    const path =
      url.split('?')[0].split('#')[0];

    const isProductDetail =
      /^\/catalogo\/\d+$/.test(path);

    const isAuthPage =
      path === '/login';

    this.visible =
      !isProductDetail &&
      !isAuthPage;

    this.changeDetectorRef.markForCheck();
  }
}
import {
  ChangeDetectorRef,
  Component,
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
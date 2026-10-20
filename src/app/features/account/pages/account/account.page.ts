import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  helpCircleOutline,
  logInOutline,
  notificationsOutline,
  personCircleOutline,
  refreshOutline,
  settingsOutline,
} from 'ionicons/icons';

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
  constructor(
    private readonly router: Router,
    private readonly uiToast: UiToastService,
  ) {
    addIcons({
      helpCircleOutline,
      logInOutline,
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
}
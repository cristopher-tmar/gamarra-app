import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  shirtOutline,
} from 'ionicons/icons';
import { UiChipComponent } from '@shared/components/ui-chip/ui-chip.component';
import { UiCoachmarkComponent } from '@shared/components/ui-coachmark/ui-coachmark.component';
import { UiProductCardComponent } from '@shared/components/ui-product-card/ui-product-card.component';
import { UiSearchBarComponent } from '@shared/components/ui-search-bar/ui-search-bar.component';
import { UiSectionHeaderComponent } from '@shared/components/ui-section-header/ui-section-header.component';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  imports: [
    IonContent,
    UiChipComponent,
    UiProductCardComponent,
    UiSearchBarComponent,
    UiSectionHeaderComponent,
    UiCoachmarkComponent,
  ],
})
export class CatalogPage {

  showVisualSearchTutorial =
    localStorage.getItem(
      'visual-search-tutorial-seen',
    ) !== 'true';

  constructor() {
    addIcons({
      cameraOutline,
      shirtOutline,
    });
  }

  dismissVisualSearchTutorial(): void {
    this.showVisualSearchTutorial = false;

    localStorage.setItem(
      'visual-search-tutorial-seen',
      'true',
    );
  }
}
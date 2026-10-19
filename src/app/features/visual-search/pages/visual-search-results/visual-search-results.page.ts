import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cameraOutline,
} from 'ionicons/icons';

import {
  VisualSearchProduct,
  VisualSearchState,
} from '@features/visual-search/models/visual-search.models';
import {
  VisualSearchService,
} from '@features/visual-search/services/visual-search';
import {
  UiButtonComponent,
} from '@shared/components/ui-button/ui-button.component';
import {
  UiEmptyStateComponent,
} from '@shared/components/ui-empty-state/ui-empty-state.component';
import {
  UiProductCardComponent,
} from '@shared/components/ui-product-card/ui-product-card.component';

@Component({
  selector: 'app-visual-search-results',
  templateUrl: './visual-search-results.page.html',
  styleUrls: ['./visual-search-results.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    UiButtonComponent,
    UiEmptyStateComponent,
    UiProductCardComponent,
  ],
})
export class VisualSearchResultsPage
  implements OnInit
{
  state?: VisualSearchState;

  constructor(
    private readonly visualSearchService:
      VisualSearchService,
    private readonly router: Router,
  ) {
    addIcons({
      arrowBackOutline,
      cameraOutline,
    });
  }

  ngOnInit(): void {
    this.state =
      this.visualSearchService.getState();
  }

  get products(): VisualSearchProduct[] {
    return this.state?.response.productos ?? [];
  }

  get totalResults(): number {
    return this.state?.response.total ?? 0;
  }

  get queryImageUrl(): string | undefined {
    return this.state?.queryImageUrl;
  }

  goBack(): void {
    void this.router.navigate([
      '/busqueda-visual',
    ]);
  }

  openProduct(
    productId: number,
  ): void {
    void this.router.navigate([
      '/catalogo',
      productId,
    ]);
  }
}
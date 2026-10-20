import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { CatalogProduct } from '@features/catalog/models/catalog.models';
import { FavoritesService } from '@features/favorites/services/favorites';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import { UiProductCardComponent } from '@shared/components/ui-product-card/ui-product-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    IonContent,
    UiEmptyStateComponent,
    UiProductCardComponent,
  ],
})
export class FavoritesPage {
  readonly favorites =
    this.favoritesService.favorites;

  constructor(
    private readonly favoritesService:
      FavoritesService,
    private readonly router: Router,
  ) {}

  removeFavorite(
    productId: number,
  ): void {
    this.favoritesService.remove(
      productId,
    );
  }

  openProduct(
    productId: number,
  ): void {
    void this.router.navigate([
      '/catalogo',
      productId,
    ]);
  }

  goToCatalog(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }

  trackProduct(
    product: CatalogProduct,
  ): number {
    return product.id;
  }
}
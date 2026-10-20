import {
  Injectable,
  signal,
} from '@angular/core';

import {
  CatalogProduct,
} from '@features/catalog/models/catalog.models';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly storageKey =
    'gamarra-favorite-products';

  private readonly favoritesSignal =
    signal<CatalogProduct[]>(
      this.loadFavorites(),
    );

  readonly favorites =
    this.favoritesSignal.asReadonly();

  isFavorite(
    productId: number,
  ): boolean {
    return this.favoritesSignal()
      .some(
        (product) =>
          product.id === productId,
      );
  }

  toggle(
    product: CatalogProduct,
  ): boolean {
    if (this.isFavorite(product.id)) {
      this.remove(product.id);
      return false;
    }

    this.add(product);
    return true;
  }

  add(
    product: CatalogProduct,
  ): void {
    if (this.isFavorite(product.id)) {
      return;
    }

    const updatedFavorites = [
      product,
      ...this.favoritesSignal(),
    ];

    this.updateFavorites(
      updatedFavorites,
    );
  }

  remove(
    productId: number,
  ): void {
    const updatedFavorites =
      this.favoritesSignal().filter(
        (product) =>
          product.id !== productId,
      );

    this.updateFavorites(
      updatedFavorites,
    );
  }

  clear(): void {
    this.updateFavorites([]);
  }

  private updateFavorites(
    favorites: CatalogProduct[],
  ): void {
    this.favoritesSignal.set(
      favorites,
    );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(favorites),
    );
  }

  private loadFavorites():
    CatalogProduct[] {
    try {
      const storedFavorites =
        localStorage.getItem(
          this.storageKey,
        );

      if (!storedFavorites) {
        return [];
      }

      const parsedFavorites =
        JSON.parse(storedFavorites);

      return Array.isArray(
        parsedFavorites,
      )
        ? parsedFavorites
        : [];
    } catch {
      return [];
    }
  }
}
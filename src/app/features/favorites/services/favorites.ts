import {
  Injectable,
  signal,
} from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import {
  finalize,
} from 'rxjs';

import {
  environment,
} from '@environments/environment';
import {
  CatalogProduct,
} from '@features/catalog/models/catalog.models';
import {
  AddFavoriteResponse,
  FavoritesResponse,
  RemoveFavoriteResponse,
} from '@features/favorites/models/favorites.models';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly apiUrl =
    `${environment.apiUrl}/favoritos`;

  private readonly favoritesSignal =
    signal<CatalogProduct[]>([]);

  private readonly loadingSignal =
    signal(false);

  private readonly pendingProductIds =
    new Set<number>();

  readonly favorites =
    this.favoritesSignal.asReadonly();

  readonly loading =
    this.loadingSignal.asReadonly();

  constructor(
    private readonly http:
      HttpClient,
  ) {}

  load(): void {
    if (this.loadingSignal()) {
      return;
    }

    this.loadingSignal.set(true);

    this.http
      .get<FavoritesResponse>(
        this.apiUrl,
      )
      .pipe(
        finalize(() => {
          this.loadingSignal.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.favoritesSignal.set(
            response.favoritos.map(
              (favorite) =>
                favorite.producto,
            ),
          );
        },
        error: () => {
          this.favoritesSignal.set([]);
        },
      });
  }

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
  ): void {
    if (
      this.pendingProductIds.has(
        product.id,
      )
    ) {
      return;
    }

    if (this.isFavorite(product.id)) {
      this.remove(product.id);
      return;
    }

    this.add(product);
  }

  add(
    product: CatalogProduct,
  ): void {
    if (
      this.isFavorite(product.id) ||
      this.pendingProductIds.has(
        product.id,
      )
    ) {
      return;
    }

    this.pendingProductIds.add(
      product.id,
    );

    this.http
      .post<AddFavoriteResponse>(
        `${this.apiUrl}/${product.id}`,
        {},
      )
      .pipe(
        finalize(() => {
          this.pendingProductIds.delete(
            product.id,
          );
        }),
      )
      .subscribe({
        next: () => {
          if (
            this.isFavorite(product.id)
          ) {
            return;
          }

          this.favoritesSignal.update(
            (favorites) => [
              product,
              ...favorites,
            ],
          );
        },
      });
  }

  remove(
    productId: number,
  ): void {
    if (
      this.pendingProductIds.has(
        productId,
      )
    ) {
      return;
    }

    this.pendingProductIds.add(
      productId,
    );

    this.http
      .delete<RemoveFavoriteResponse>(
        `${this.apiUrl}/${productId}`,
      )
      .pipe(
        finalize(() => {
          this.pendingProductIds.delete(
            productId,
          );
        }),
      )
      .subscribe({
        next: () => {
          this.favoritesSignal.update(
            (favorites) =>
              favorites.filter(
                (product) =>
                  product.id !==
                  productId,
              ),
          );
        },
      });
  }

  clear(): void {
    this.favoritesSignal.set([]);
  }
}
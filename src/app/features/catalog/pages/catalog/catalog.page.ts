import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  finalize,
} from 'rxjs';
import {
  IonContent,
} from '@ionic/angular';
import {
  addIcons,
} from 'ionicons';
import {
  cameraOutline,
  shirtOutline,
} from 'ionicons/icons';

import {
  CatalogProduct,
} from '@features/catalog/models/catalog.models';
import {
  CatalogService,
} from '@features/catalog/services/catalog';
import {
  AuthService,
} from '@features/auth/services/auth';
import {
  FavoritesService,
} from '@features/favorites/services/favorites';
import {
  UiChipComponent,
} from '@shared/components/ui-chip/ui-chip.component';
import {
  UiCoachmarkComponent,
} from '@shared/components/ui-coachmark/ui-coachmark.component';
import {
  UiEmptyStateComponent,
} from '@shared/components/ui-empty-state/ui-empty-state.component';
import {
  UiErrorStateComponent,
} from '@shared/components/ui-error-state/ui-error-state.component';
import {
  UiProductCardComponent,
} from '@shared/components/ui-product-card/ui-product-card.component';
import {
  UiSearchBarComponent,
} from '@shared/components/ui-search-bar/ui-search-bar.component';
import {
  UiSectionHeaderComponent,
} from '@shared/components/ui-section-header/ui-section-header.component';
import {
  UiSkeletonComponent,
} from '@shared/components/ui-skeleton/ui-skeleton.component';
import {
  BehaviorEventType,
} from '@features/behavior-events/models/behavior-event.models';
import {
  BehaviorEventsService,
} from '@features/behavior-events/services/behavior-events';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  imports: [
    IonContent,
    UiChipComponent,
    UiCoachmarkComponent,
    UiEmptyStateComponent,
    UiErrorStateComponent,
    UiProductCardComponent,
    UiSearchBarComponent,
    UiSectionHeaderComponent,
    UiSkeletonComponent,
  ],
})
export class CatalogPage
  implements OnInit {
  products: CatalogProduct[] = [];

  loading = true;
  hasError = false;

  searchTerm = '';
  selectedCategory?: string;

  readonly categories = [
    'Todos',
    'Polos',
    'Casacas',
    'Pantalones',
  ];

  showVisualSearchTutorial =
    localStorage.getItem(
      'visual-search-tutorial-seen',
    ) !== 'true';

  constructor(
    private readonly catalogService:
      CatalogService,
    private readonly favoritesService:
      FavoritesService,
    private readonly authService:
      AuthService,
    private readonly router:
      Router,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
    private readonly behaviorEventsService:
      BehaviorEventsService,
  ) {
    addIcons({
      cameraOutline,
      shirtOutline,
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadFavorites();
  }

  ionViewWillEnter(): void {
    this.showVisualSearchTutorial =
      localStorage.getItem(
        'visual-search-tutorial-seen',
      ) !== 'true';

    this.loadFavorites();

    this.changeDetectorRef
      .markForCheck();
  }

  loadProducts(): void {
    this.loading = true;
    this.hasError = false;

    this.catalogService
      .getCatalog({
        pagina: 1,
        limite: 12,
        buscar:
          this.searchTerm.trim() ||
          undefined,
        categoria:
          this.selectedCategory ||
          undefined,
      })
      .pipe(
        finalize(() => {
          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.products =
            response.productos;
        },
        error: () => {
          this.products = [];
          this.hasError = true;
        },
      });
  }

  searchProducts(
    value: string,
  ): void {
    this.searchTerm = value;

    const searchTerm =
      value.trim();

    if (searchTerm) {
      this.behaviorEventsService.register({
        tipo:
          BehaviorEventType
            .BUSQUEDA_TEXTO,
        terminoBusqueda:
          searchTerm,
        metadata: {
          origen: 'catalogo',
          categoria:
            this.selectedCategory ??
            null,
        },
      });
    }

    this.loadProducts();
  }

  selectCategory(
    category: string,
  ): void {
    this.selectedCategory =
      category === 'Todos'
        ? undefined
        : category;

    this.loadProducts();
  }

  openProduct(
    productId: number,
  ): void {
    void this.router.navigate([
      '/catalogo',
      productId,
    ]);
  }

  openVisualSearch(): void {
    void this.router.navigate([
      '/busqueda-visual',
    ]);
  }

  dismissVisualSearchTutorial(): void {
    this.showVisualSearchTutorial = false;

    localStorage.setItem(
      'visual-search-tutorial-seen',
      'true',
    );
  }

  isFavorite(
    productId: number,
  ): boolean {
    return this.favoritesService
      .isFavorite(productId);
  }

  toggleFavorite(
    product: CatalogProduct,
  ): void {
    if (
      !this.authService
        .isAuthenticated()
    ) {
      void this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: '/catalogo',
          },
        },
      );

      return;
    }

    this.favoritesService
      .toggle(product);
  }

  private loadFavorites(): void {
    if (
      !this.authService
        .isAuthenticated()
    ) {
      this.favoritesService.clear();
      return;
    }

    this.favoritesService.load();
  }
}
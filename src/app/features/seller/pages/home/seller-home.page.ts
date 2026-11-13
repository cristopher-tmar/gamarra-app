import {
  Component,
  signal,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  addIcons,
} from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  arrowForwardOutline,
  barChartOutline,
  cubeOutline,
  eyeOutline,
  gridOutline,
  logoWhatsapp,
  trendingUpOutline,
} from 'ionicons/icons';

import {
  CatalogService,
} from '@features/catalog/services/catalog';
import {
  ProductPrediction,
} from '@features/dashboard/models/prediction.models';
import {
  PredictionsService,
} from '@features/dashboard/services/predictions';
import {
  getSellerProductStatus,
} from '@features/seller/models/seller-product.models';
import {
  SellerDemoStoreService,
} from '@features/seller/services/seller-demo-store';
import {
  UiEmptyStateComponent,
} from '@shared/components/ui-empty-state/ui-empty-state.component';
import {
  UiErrorStateComponent,
} from '@shared/components/ui-error-state/ui-error-state.component';
import {
  UiSkeletonComponent,
} from '@shared/components/ui-skeleton/ui-skeleton.component';

interface SellerMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  variant:
    | 'primary'
    | 'success'
    | 'warning'
    | 'neutral';
}

interface TopProduct {
  position: number;
  productId: number;
  name: string;
  category: string;
  score: number;
  interactions: number;
  imageUrl: string | null;
}

/** Periodo usado para el ranking de Inicio. */
const TOP_PRODUCTS_DAYS = 30;
const TOP_PRODUCTS_LIMIT = 3;

interface SellerAlert {
  productName: string;
  message: string;
  level:
    | 'URGENTE'
    | 'REPONER'
    | 'OBSERVAR';
}

@Component({
  selector: 'app-seller-home',
  templateUrl:
    './seller-home.page.html',
  styleUrls: [
    './seller-home.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
    UiEmptyStateComponent,
    UiErrorStateComponent,
    UiSkeletonComponent,
  ],
})
export class SellerHomePage {
  /**
   * Las métricas de inventario se calculan con los
   * productos del modo demo. Vistas y contactos son
   * cifras de referencia de la demostración.
   */
  get metrics(): SellerMetric[] {
    const products =
      this.demoStore.products();

    const counts =
      this.demoStore.statusCounts();

    const pendingAlerts =
      counts.STOCK_BAJO + counts.AGOTADO;

    return [
      {
        label: 'Productos activos',
        value: String(
          counts.ACTIVO + counts.STOCK_BAJO,
        ),
        detail:
          `${products.length} productos registrados`,
        icon: 'cube-outline',
        variant: 'primary',
      },
      {
        label: 'Vistas del catálogo',
        value: '418',
        detail:
          '+18% durante esta semana',
        icon: 'eye-outline',
        variant: 'success',
      },
      {
        label: 'Contactos por WhatsApp',
        value: '56',
        detail:
          '13 contactos esta semana',
        icon: 'logo-whatsapp',
        variant: 'success',
      },
      {
        label: 'Alertas pendientes',
        value: String(pendingAlerts),
        detail:
          counts.AGOTADO > 0
            ? `${counts.AGOTADO} requiere${counts.AGOTADO > 1 ? 'n' : ''} atención urgente`
            : 'Sin productos agotados',
        icon: 'alert-circle-outline',
        variant: 'warning',
      },
    ];
  }

  get alerts(): SellerAlert[] {
    return this.demoStore
      .products()
      .flatMap((product): SellerAlert[] => {
        const status =
          getSellerProductStatus(product);

        if (status === 'AGOTADO') {
          return [{
            productName: product.nombre,
            message:
              'Producto agotado. Repón stock para seguir vendiendo.',
            level: 'URGENTE',
          }];
        }

        if (status === 'STOCK_BAJO') {
          return [{
            productName: product.nombre,
            message:
              `Quedan ${product.stock} unidades. Se recomienda programar reposición.`,
            level: 'REPONER',
          }];
        }

        return [];
      });
  }

  /**
   * Ranking real: proviene del API de predicciones.
   */
  readonly topProducts =
    signal<TopProduct[]>([]);

  readonly topProductsLoading =
    signal(true);

  readonly topProductsError =
    signal(false);

  constructor(
    private readonly router:
      Router,
    private readonly demoStore:
      SellerDemoStoreService,
    private readonly predictionsService:
      PredictionsService,
    private readonly catalogService:
      CatalogService,
  ) {
    addIcons({
      addOutline,
      alertCircleOutline,
      arrowForwardOutline,
      barChartOutline,
      cubeOutline,
      eyeOutline,
      gridOutline,
      logoWhatsapp,
      trendingUpOutline,
    });
  }

  ionViewWillEnter(): void {
    this.loadTopProducts();
  }

  loadTopProducts(): void {
    this.topProductsLoading.set(true);
    this.topProductsError.set(false);

    this.predictionsService
      .getSummary(TOP_PRODUCTS_DAYS)
      .pipe(
        map((response) =>
          response.productosConMayorInteres
            .slice(0, TOP_PRODUCTS_LIMIT),
        ),
        switchMap((products) =>
          products.length
            ? forkJoin(
              products.map((product) =>
                this.toTopProduct(product),
              ),
            )
            : of([]),
        ),
      )
      .subscribe({
        next: (products) => {
          this.topProducts.set(products);
          this.topProductsLoading.set(false);
        },
        error: () => {
          this.topProductsError.set(true);
          this.topProductsLoading.set(false);
        },
      });
  }

  goToProducts(): void {
    void this.router.navigate([
      '/vendedor/productos',
    ]);
  }

  createProduct(): void {
    void this.router.navigate([
      '/vendedor/productos/nuevo',
    ]);
  }

  goToDashboard(): void {
    void this.router.navigate([
      '/vendedor/dashboard',
    ]);
  }

  goToAlerts(): void {
    void this.router.navigate(
      [
        '/vendedor/productos',
      ],
      {
        queryParams: {
          estado: 'STOCK_BAJO',
        },
      },
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

  /**
   * El ranking no incluye imágenes; se obtienen
   * del detalle del catálogo. Si falla, se muestra
   * la inicial de la categoría.
   */
  private toTopProduct(
    product: ProductPrediction,
  ): Observable<TopProduct> {
    const base: TopProduct = {
      position: product.posicion,
      productId: product.productoId,
      name: product.nombre,
      category: product.categoria,
      score: product.score,
      interactions:
        product.totalInteracciones,
      imageUrl: null,
    };

    return this.catalogService
      .getProductDetail(product.productoId)
      .pipe(
        map((response) => ({
          ...base,
          imageUrl:
            response.producto.imagenPrincipal
              ?.url ?? null,
        })),
        catchError(() => of(base)),
      );
  }
}

import {
  Component,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
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
  getSellerProductStatus,
} from '@features/seller/models/seller-product.models';
import {
  SellerDemoStoreService,
} from '@features/seller/services/seller-demo-store';

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

  readonly topProducts = [
    {
      position: 1,
      productId: 9,
      name:
        'Polo Topitop oversize marrón',
      category: 'Polos',
      score: 32,
      interactions: 149,
      imageUrl:
        'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/9/6c73bfcc-50da-4c6c-8aae-5eb2f902fa65.webp',
    },
    {
      position: 2,
      productId: 1,
      name:
        'Polo Basement cuello camisero beige',
      category: 'Polos',
      score: 24,
      interactions: 110,
      imageUrl:
        'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/1/f287117b-1c8e-46ad-beef-0b8b953a9214.webp',
    },
    {
      position: 3,
      productId: 3,
      name:
        'Polera Denimlab marrón',
      category: 'Poleras',
      score: 17,
      interactions: 83,
      imageUrl:
        'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/3/83d6f6e4-b729-4dac-a323-8ec25eb77fc2.webp',
    },
  ];

  constructor(
    private readonly router:
      Router,
    private readonly demoStore:
      SellerDemoStoreService,
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
}
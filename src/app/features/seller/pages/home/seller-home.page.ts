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
  readonly metrics:
    SellerMetric[] = [
      {
        label: 'Productos activos',
        value: '3',
        detail:
          '5 productos registrados',
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
        value: '3',
        detail:
          '1 requiere atención urgente',
        icon: 'alert-circle-outline',
        variant: 'warning',
      },
    ];

  readonly alerts:
    SellerAlert[] = [
      {
        productName:
          'Polera Denimlab marrón',
        message:
          'Quedan 2 unidades. La demanda estimada supera el stock actual.',
        level: 'URGENTE',
      },
      {
        productName:
          'Polo Basement cuello camisero',
        message:
          'Quedan 5 unidades. Se recomienda programar reposición.',
        level: 'REPONER',
      },
      {
        productName:
          'Polo La Martina rosado',
        message:
          'El interés aumentó 22% durante los últimos 7 días.',
        level: 'OBSERVAR',
      },
    ];

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
    void this.router.navigate([
      '/vendedor/alertas',
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
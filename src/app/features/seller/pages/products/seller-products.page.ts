import {
  Component,
} from '@angular/core';
import {
  FormsModule,
} from '@angular/forms';
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
  checkmarkCircleOutline,
  createOutline,
  cubeOutline,
  ellipsisHorizontalOutline,
  searchOutline,
} from 'ionicons/icons';

type SellerProductStatus =
  | 'ACTIVO'
  | 'STOCK_BAJO'
  | 'AGOTADO';

interface SellerProduct {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  status: SellerProductStatus;
  imageUrl: string;
  views: number;
  contacts: number;
}

@Component({
  selector: 'app-seller-products',
  templateUrl:
    './seller-products.page.html',
  styleUrls: [
    './seller-products.page.scss',
  ],
  imports: [
    FormsModule,
    IonContent,
    IonIcon,
  ],
})
export class SellerProductsPage {
  searchTerm = '';
  selectedStatus = 'TODOS';

  readonly statusOptions = [
    {
      value: 'TODOS',
      label: 'Todos',
    },
    {
      value: 'ACTIVO',
      label: 'Activos',
    },
    {
      value: 'STOCK_BAJO',
      label: 'Stock bajo',
    },
    {
      value: 'AGOTADO',
      label: 'Agotados',
    },
  ];

  readonly products:
    SellerProduct[] = [
      {
        id: 9,
        codigo: 'TOP-001',
        nombre:
          'Polo Topitop oversize marrón',
        categoria: 'Polos',
        precio: 79.9,
        stock: 14,
        status: 'ACTIVO',
        imageUrl:
          'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/9/6c73bfcc-50da-4c6c-8aae-5eb2f902fa65.webp',
        views: 128,
        contacts: 21,
      },
      {
        id: 1,
        codigo: 'BAS-001',
        nombre:
          'Polo Basement cuello camisero beige',
        categoria: 'Polos',
        precio: 69.9,
        stock: 5,
        status: 'STOCK_BAJO',
        imageUrl:
          'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/1/f287117b-1c8e-46ad-beef-0b8b953a9214.webp',
        views: 96,
        contacts: 14,
      },
      {
        id: 3,
        codigo: 'DEN-001',
        nombre:
          'Polera Denimlab marrón',
        categoria: 'Poleras',
        precio: 119.9,
        stock: 2,
        status: 'STOCK_BAJO',
        imageUrl:
          'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/3/83d6f6e4-b729-4dac-a323-8ec25eb77fc2.webp',
        views: 74,
        contacts: 9,
      },
      {
        id: 8,
        codigo: 'SAG-002',
        nombre:
          'Polo Saga oversize marrón estampado',
        categoria: 'Polos',
        precio: 89.9,
        stock: 0,
        status: 'AGOTADO',
        imageUrl:
          'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/8/95cafc42-74e3-4e26-9cca-c54f94f5486d.webp',
        views: 61,
        contacts: 7,
      },
      {
        id: 5,
        codigo: 'LAM-001',
        nombre:
          'Polo La Martina rosado estampado',
        categoria: 'Polos',
        precio: 89.9,
        stock: 18,
        status: 'ACTIVO',
        imageUrl:
          'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/5/9895778a-d650-4e95-8449-f0c30113caaf.webp',
        views: 59,
        contacts: 5,
      },
    ];

  constructor(
    private readonly router:
      Router,
  ) {
    addIcons({
      addOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      createOutline,
      cubeOutline,
      ellipsisHorizontalOutline,
      searchOutline,
    });
  }

  get filteredProducts():
    SellerProduct[] {
    const normalizedSearch =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.products.filter(
      (product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.nombre
            .toLowerCase()
            .includes(
              normalizedSearch,
            ) ||
          product.codigo
            .toLowerCase()
            .includes(
              normalizedSearch,
            ) ||
          product.categoria
            .toLowerCase()
            .includes(
              normalizedSearch,
            );

        const matchesStatus =
          this.selectedStatus ===
            'TODOS' ||
          product.status ===
            this.selectedStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );
  }

  get activeProducts(): number {
    return this.products.filter(
      (product) =>
        product.status === 'ACTIVO',
    ).length;
  }

  get lowStockProducts(): number {
    return this.products.filter(
      (product) =>
        product.status ===
        'STOCK_BAJO',
    ).length;
  }

  get outOfStockProducts(): number {
    return this.products.filter(
      (product) =>
        product.status === 'AGOTADO',
    ).length;
  }

  statusLabel(
    status: SellerProductStatus,
  ): string {
    const labels:
      Record<
        SellerProductStatus,
        string
      > = {
        ACTIVO: 'Activo',
        STOCK_BAJO: 'Stock bajo',
        AGOTADO: 'Agotado',
      };

    return labels[status];
  }

  createProduct(): void {
    void this.router.navigate([
      '/vendedor/productos/nuevo',
    ]);
  }

  editProduct(
    productId: number,
  ): void {
    void this.router.navigate([
      '/vendedor/productos',
      productId,
      'editar',
    ]);
  }
}
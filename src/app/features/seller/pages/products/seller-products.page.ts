import {
  Component,
} from '@angular/core';
import {
  FormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
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
  trashOutline,
} from 'ionicons/icons';

import {
  getSellerProductStatus,
  SellerProduct,
  SellerProductStatus,
} from '@features/seller/models/seller-product.models';
import {
  SellerDemoStoreService,
} from '@features/seller/services/seller-demo-store';
import {
  UiConfirmService,
} from '@shared/services/ui-confirm';
import {
  UiToastService,
} from '@shared/services/ui-toast';

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

  readonly getStatus =
    getSellerProductStatus;

  constructor(
    private readonly router:
      Router,
    private readonly route:
      ActivatedRoute,
    private readonly demoStore:
      SellerDemoStoreService,
    private readonly uiConfirm:
      UiConfirmService,
    private readonly uiToast:
      UiToastService,
  ) {
    addIcons({
      addOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      createOutline,
      cubeOutline,
      ellipsisHorizontalOutline,
      searchOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    const status =
      this.route.snapshot.queryParamMap
        .get('estado');

    if (
      status &&
      this.statusOptions.some(
        (option) => option.value === status,
      )
    ) {
      this.selectedStatus = status;
    }
  }

  get products(): SellerProduct[] {
    return this.demoStore.products();
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
          getSellerProductStatus(product) ===
            this.selectedStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );
  }

  get activeProducts(): number {
    return this.demoStore
      .statusCounts().ACTIVO;
  }

  get lowStockProducts(): number {
    return this.demoStore
      .statusCounts().STOCK_BAJO;
  }

  get outOfStockProducts(): number {
    return this.demoStore
      .statusCounts().AGOTADO;
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
        INACTIVO: 'Inactivo',
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

  async deleteProduct(
    product: SellerProduct,
  ): Promise<void> {
    const confirmed =
      await this.uiConfirm.confirmDelete(
        `"${product.nombre}"`,
      );

    if (!confirmed) {
      return;
    }

    try {
      this.demoStore.deleteProduct(
        product.id,
      );

      void this.uiToast.success(
        'Producto eliminado (modo demo)',
      );
    } catch {
      void this.uiToast.error(
        'No pudimos eliminar el producto',
      );
    }
  }
}

import {
  Location,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  finalize,
} from 'rxjs';
import {
  addIcons,
} from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  locationOutline,
  logoWhatsapp,
  storefrontOutline,
} from 'ionicons/icons';

import {
  BehaviorEventType,
} from '@features/behavior-events/models/behavior-event.models';
import {
  BehaviorEventsService,
} from '@features/behavior-events/services/behavior-events';
import {
  ProductDetail,
} from '@features/catalog/models/catalog.models';
import {
  CatalogService,
} from '@features/catalog/services/catalog';
import {
  UiEmptyStateComponent,
} from '@shared/components/ui-empty-state/ui-empty-state.component';
import {
  UiErrorStateComponent,
} from '@shared/components/ui-error-state/ui-error-state.component';
import {
  UiSkeletonComponent,
} from '@shared/components/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'app-product-detail',
  templateUrl:
    './product-detail.page.html',
  styleUrls: [
    './product-detail.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
    UiEmptyStateComponent,
    UiErrorStateComponent,
    UiSkeletonComponent,
  ],
})
export class ProductDetailPage
  implements OnInit {
  product?: ProductDetail;

  loading = true;
  hasError = false;

  selectedImageUrl?: string;

  private registeredViewProductId?:
    number;

  constructor(
    private readonly route:
      ActivatedRoute,
    private readonly router:
      Router,
    private readonly catalogService:
      CatalogService,
    private readonly behaviorEventsService:
      BehaviorEventsService,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
    private readonly location:
      Location,
  ) {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      locationOutline,
      logoWhatsapp,
      storefrontOutline,
    });
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  get productId(): number {
    return Number(
      this.route.snapshot.paramMap.get(
        'productoId',
      ),
    );
  }

  get attributes():
    Record<string, unknown> {
    return this.product?.atributos ?? {};
  }

  get sizes(): string[] {
    const sizes =
      this.attributes['tallas'];

    return Array.isArray(sizes)
      ? sizes.map(String)
      : [];
  }

  get colors(): string[] {
    const colors =
      this.attributes['colores'];

    return Array.isArray(colors)
      ? colors.map(String)
      : [];
  }

  get whatsappUrl(): string | null {
    const phone =
      this.product?.tienda.telefono;

    if (
      !phone ||
      !this.product
    ) {
      return null;
    }

    const normalizedPhone =
      phone.replace(/\D/g, '');

    const internationalPhone =
      normalizedPhone.startsWith('51')
        ? normalizedPhone
        : `51${normalizedPhone}`;

    const message =
      `Hola, vi el producto "${this.product.nombre}" ` +
      'en Gamarra App. ¿Podrían darme más información?';

    return (
      `https://wa.me/${internationalPhone}` +
      `?text=${encodeURIComponent(message)}`
    );
  }

  loadProduct(): void {
    if (
      !Number.isInteger(this.productId) ||
      this.productId < 1
    ) {
      this.loading = false;
      this.hasError = true;
      return;
    }

    this.loading = true;
    this.hasError = false;

    this.catalogService
      .getProductDetail(
        this.productId,
      )
      .pipe(
        finalize(() => {
          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.product =
            response.producto;

          this.selectedImageUrl =
            response.producto
              .imagenPrincipal?.url ??
            response.producto
              .imagenes[0]?.url;

          this.registerProductView(
            response.producto,
          );
        },
        error: () => {
          this.product = undefined;
          this.selectedImageUrl =
            undefined;
          this.hasError = true;
        },
      });
  }

  selectImage(
    imageUrl: string,
  ): void {
    this.selectedImageUrl =
      imageUrl;
  }

  getAttribute(
    attributeName: string,
  ): string {
    const value =
      this.attributes[
        attributeName
      ];

    if (
      value === null ||
      value === undefined
    ) {
      return 'No especificado';
    }

    return Array.isArray(value)
      ? value.join(', ')
      : String(value);
  }

  goBack(): void {
    this.location.back();
  }

  private registerProductView(
    product: ProductDetail,
  ): void {
    if (
      this.registeredViewProductId ===
      product.id
    ) {
      return;
    }

    this.registeredViewProductId =
      product.id;

    this.behaviorEventsService.register({
      tipo:
        BehaviorEventType
          .PRODUCTO_VISTO,
      productoId: product.id,
      metadata: {
        origen: 'detalle_producto',
        categoria:
          product.categoria,
        tiendaId:
          product.tienda.id,
        tiendaCodigo:
          product.tienda.codigo,
        disponible:
          product.disponible,
        precio:
          product.precio,
      },
    });
  }
}
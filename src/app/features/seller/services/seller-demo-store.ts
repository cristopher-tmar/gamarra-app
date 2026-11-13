import {
  computed,
  Injectable,
  signal,
} from '@angular/core';

import {
  getSellerProductStatus,
  SellerConsent,
  SellerProduct,
  SellerProductInput,
} from '@features/seller/models/seller-product.models';

/**
 * MODO DEMO del panel del vendedor.
 *
 * Persiste productos y consentimientos en
 * localStorage. No consume endpoints ni
 * sincroniza datos con el backend.
 */
@Injectable({
  providedIn: 'root',
})
export class SellerDemoStoreService {
  private readonly productsKey =
    'gamarra-demo:seller-products';

  private readonly consentKey =
    'gamarra-demo:seller-consent';

  /**
   * Los ids locales empiezan en un rango alto
   * para no confundirse con ids reales.
   */
  private readonly localIdStart = 100000;

  private readonly productsSignal =
    signal<SellerProduct[]>(
      this.loadProducts(),
    );

  private readonly consentSignal =
    signal<SellerConsent>(
      this.loadConsent(),
    );

  readonly products =
    this.productsSignal.asReadonly();

  readonly consent =
    this.consentSignal.asReadonly();

  readonly statusCounts = computed(() => {
    const counts = {
      ACTIVO: 0,
      STOCK_BAJO: 0,
      AGOTADO: 0,
      INACTIVO: 0,
    };

    for (const product of this.productsSignal()) {
      counts[getSellerProductStatus(product)]++;
    }

    return counts;
  });

  getProduct(
    productId: number,
  ): SellerProduct | undefined {
    return this.productsSignal().find(
      (product) => product.id === productId,
    );
  }

  isCodeTaken(
    codigo: string,
    excludeId: number | null = null,
  ): boolean {
    const normalized =
      codigo.trim().toLowerCase();

    return this.productsSignal().some(
      (product) =>
        product.id !== excludeId &&
        product.codigo.trim().toLowerCase() ===
          normalized,
    );
  }

  createProduct(
    input: SellerProductInput,
  ): SellerProduct {
    const now = new Date().toISOString();
    const products = this.productsSignal();

    const nextId = Math.max(
      this.localIdStart - 1,
      ...products.map((product) => product.id),
    ) + 1;

    const product: SellerProduct = {
      ...this.normalizeInput(input),
      id: nextId,
      views: 0,
      contacts: 0,
      catalogProductId: null,
      fechaCreacion: now,
      fechaModificacion: now,
    };

    this.saveProducts([
      product,
      ...products,
    ]);

    return product;
  }

  updateProduct(
    productId: number,
    input: SellerProductInput,
  ): SellerProduct {
    const current =
      this.getProduct(productId);

    if (!current) {
      throw new Error(
        'Producto no encontrado',
      );
    }

    const updated: SellerProduct = {
      ...current,
      ...this.normalizeInput(input),
      fechaModificacion:
        new Date().toISOString(),
    };

    this.saveProducts(
      this.productsSignal().map(
        (product) =>
          product.id === productId
            ? updated
            : product,
      ),
    );

    return updated;
  }

  deleteProduct(
    productId: number,
  ): void {
    this.saveProducts(
      this.productsSignal().filter(
        (product) => product.id !== productId,
      ),
    );
  }

  saveConsent(
    consent: Omit<
      SellerConsent,
      'fechaModificacion'
    >,
  ): SellerConsent {
    const value: SellerConsent = {
      ...consent,
      fechaModificacion:
        new Date().toISOString(),
    };

    localStorage.setItem(
      this.consentKey,
      JSON.stringify(value),
    );

    this.consentSignal.set(value);

    return value;
  }

  private normalizeInput(
    input: SellerProductInput,
  ): SellerProductInput {
    return {
      ...input,
      nombre: input.nombre.trim(),
      codigo: input.codigo.trim().toUpperCase(),
      descripcion: input.descripcion.trim(),
      precio: Number(input.precio),
      stock: Math.trunc(Number(input.stock)),
      marca: input.marca.trim(),
      material: input.material.trim(),
      tallas: input.tallas.trim(),
      colores: input.colores.trim(),
    };
  }

  /**
   * Guarda primero en localStorage para que un
   * error de cuota no deje el estado en memoria
   * desincronizado con lo persistido.
   */
  private saveProducts(
    products: SellerProduct[],
  ): void {
    localStorage.setItem(
      this.productsKey,
      JSON.stringify(products),
    );

    this.productsSignal.set(products);
  }

  private loadProducts(): SellerProduct[] {
    try {
      const stored =
        localStorage.getItem(this.productsKey);

      if (stored) {
        const parsed =
          JSON.parse(stored) as unknown;

        if (Array.isArray(parsed)) {
          return parsed as SellerProduct[];
        }
      }
    } catch {
      localStorage.removeItem(this.productsKey);
    }

    const seed = createSeedProducts();

    try {
      localStorage.setItem(
        this.productsKey,
        JSON.stringify(seed),
      );
    } catch {
      /* Sin almacenamiento: la demo funciona en memoria. */
    }

    return seed;
  }

  private loadConsent(): SellerConsent {
    const defaults: SellerConsent = {
      imageProcessingConsent: true,
      analyticsConsent: true,
      academicUseConsent: true,
      fechaModificacion: null,
    };

    try {
      const stored =
        localStorage.getItem(this.consentKey);

      return stored
        ? {
          ...defaults,
          ...(JSON.parse(stored) as Partial<SellerConsent>),
        }
        : defaults;
    } catch {
      localStorage.removeItem(this.consentKey);

      return defaults;
    }
  }
}

const IMAGE_BASE_URL =
  'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos';

/**
 * Datos iniciales de la demo. Toman como base
 * productos existentes del catálogo para que la
 * demostración arranque con información realista.
 */
function createSeedProducts(): SellerProduct[] {
  const now = new Date().toISOString();

  const seed: Array<
    Omit<
      SellerProduct,
      | 'fechaCreacion'
      | 'fechaModificacion'
      | 'catalogProductId'
      | 'activo'
      | 'consentimientoIa'
    >
  > = [
    {
      id: 9,
      codigo: 'TOP-001',
      nombre: 'Polo Topitop oversize marrón',
      categoria: 'Polos',
      descripcion:
        'Polo oversize de algodón, diseño urbano y acabado suave.',
      precio: 79.9,
      stock: 14,
      marca: 'Topitop',
      material: 'Algodón',
      tallas: 'S, M, L, XL',
      colores: 'Marrón, Beige',
      imageUrl:
        `${IMAGE_BASE_URL}/9/6c73bfcc-50da-4c6c-8aae-5eb2f902fa65.webp`,
      views: 128,
      contacts: 21,
    },
    {
      id: 1,
      codigo: 'BAS-001',
      nombre: 'Polo Basement cuello camisero beige',
      categoria: 'Polos',
      descripcion:
        'Polo con cuello camisero, tejido piqué y corte regular.',
      precio: 69.9,
      stock: 5,
      marca: 'Basement',
      material: 'Algodón piqué',
      tallas: 'S, M, L',
      colores: 'Beige',
      imageUrl:
        `${IMAGE_BASE_URL}/1/f287117b-1c8e-46ad-beef-0b8b953a9214.webp`,
      views: 96,
      contacts: 14,
    },
    {
      id: 3,
      codigo: 'DEN-001',
      nombre: 'Polera Denimlab marrón',
      categoria: 'Poleras',
      descripcion:
        'Polera con capucha y bolsillo canguro, interior afelpado.',
      precio: 119.9,
      stock: 2,
      marca: 'Denimlab',
      material: 'Algodón french terry',
      tallas: 'M, L, XL',
      colores: 'Marrón',
      imageUrl:
        `${IMAGE_BASE_URL}/3/83d6f6e4-b729-4dac-a323-8ec25eb77fc2.webp`,
      views: 74,
      contacts: 9,
    },
    {
      id: 8,
      codigo: 'SAG-002',
      nombre: 'Polo Saga oversize marrón estampado',
      categoria: 'Polos',
      descripcion:
        'Polo oversize con estampado frontal de edición limitada.',
      precio: 89.9,
      stock: 0,
      marca: 'Saga',
      material: 'Algodón',
      tallas: 'M, L',
      colores: 'Marrón',
      imageUrl:
        `${IMAGE_BASE_URL}/8/95cafc42-74e3-4e26-9cca-c54f94f5486d.webp`,
      views: 61,
      contacts: 7,
    },
    {
      id: 5,
      codigo: 'LAM-001',
      nombre: 'Polo La Martina rosado estampado',
      categoria: 'Polos',
      descripcion:
        'Polo de corte clásico con estampado en el pecho.',
      precio: 89.9,
      stock: 18,
      marca: 'La Martina',
      material: 'Algodón pima',
      tallas: 'S, M, L, XL',
      colores: 'Rosado',
      imageUrl:
        `${IMAGE_BASE_URL}/5/9895778a-d650-4e95-8449-f0c30113caaf.webp`,
      views: 59,
      contacts: 5,
    },
  ];

  return seed.map((product) => ({
    ...product,
    activo: true,
    consentimientoIa: true,
    catalogProductId: product.id,
    fechaCreacion: now,
    fechaModificacion: now,
  }));
}

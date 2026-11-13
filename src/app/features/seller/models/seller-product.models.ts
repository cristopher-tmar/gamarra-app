/**
 * Modelos del panel del vendedor en MODO DEMO.
 *
 * Estos registros viven únicamente en el
 * almacenamiento local del navegador y no se
 * sincronizan con el backend.
 */

export type SellerProductStatus =
  | 'ACTIVO'
  | 'STOCK_BAJO'
  | 'AGOTADO'
  | 'INACTIVO';

export interface SellerProductInput {
  nombre: string;
  codigo: string;
  categoria: string;
  descripcion: string;
  precio: number;
  stock: number;
  marca: string;
  material: string;
  tallas: string;
  colores: string;
  activo: boolean;
  consentimientoIa: boolean;
  imageUrl: string | null;
}

export interface SellerProduct
  extends SellerProductInput {
  id: number;
  views: number;
  contacts: number;
  /**
   * Indica si el producto corresponde a un
   * registro real del catálogo (semilla de demo)
   * o si fue creado localmente.
   */
  catalogProductId: number | null;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface SellerConsent {
  imageProcessingConsent: boolean;
  analyticsConsent: boolean;
  academicUseConsent: boolean;
  fechaModificacion: string | null;
}

export const SELLER_LOW_STOCK_THRESHOLD = 5;

export function getSellerProductStatus(
  product: Pick<
    SellerProduct,
    'activo' | 'stock'
  >,
): SellerProductStatus {
  if (!product.activo) {
    return 'INACTIVO';
  }

  if (product.stock <= 0) {
    return 'AGOTADO';
  }

  if (
    product.stock <=
    SELLER_LOW_STOCK_THRESHOLD
  ) {
    return 'STOCK_BAJO';
  }

  return 'ACTIVO';
}

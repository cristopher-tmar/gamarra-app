export interface CatalogStore {
  id: number;
  codigo: string;
  nombre: string;
  galeria: string;
  piso: string | null;
  numeroLocal: string;
}

export interface CatalogImage {
  id: number;
  url: string;
  nombreOriginal: string;
  mimeType: string;
  tamanioBytes: number;
  ancho: number | null;
  alto: number | null;
  principal: boolean;
  orden: number;
  fechaCreacion: string;
}

export interface CatalogProduct {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  stock: number;
  atributos: Record<string, unknown> | null;
  fechaCreacion: string;
  tienda: CatalogStore;
  precio: number;
  disponible: boolean;
  imagenPrincipal: CatalogImage | null;
}

export interface CatalogFilters {
  buscar: string | null;
  categoria: string | null;
  tiendaId: number | null;
}

export interface CatalogResponse {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
  filtros: CatalogFilters;
  productos: CatalogProduct[];
}

export interface ProductStoreDetail extends CatalogStore {
  descripcion: string | null;
  telefono: string | null;
}

export interface ProductDetail {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  atributos: Record<string, unknown> | null;
  fechaCreacion: string;
  fechaModificacion: string;
  tienda: ProductStoreDetail;
  imagenes: CatalogImage[];
  disponible: boolean;
  imagenPrincipal: CatalogImage | null;
}

export interface ProductDetailResponse {
  mensaje: string;
  producto: ProductDetail;
}

export interface CatalogQuery {
  pagina?: number;
  limite?: number;
  buscar?: string;
  categoria?: string;
  tiendaId?: number;
}
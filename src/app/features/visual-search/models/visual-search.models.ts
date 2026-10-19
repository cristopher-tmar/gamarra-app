export interface VisualSearchQuery {
  nombreOriginal: string;
  mimeType: string;
  modelo: string;
  dimension: number;
  tiempoProcesamientoMs: number;
}

export interface VisualSearchCriteria {
  similitudMinima: number;
  similitudMinimaPorcentaje: number;
}

export interface VisualSearchProduct {
  productoId: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagenId: number;
  imagenUrl: string;
  distancia: number;
  similitud: number;
  similitudPorcentaje: number;
}

export interface VisualSearchResponse {
  mensaje: string;
  consulta: VisualSearchQuery;
  criterioBusqueda: VisualSearchCriteria;
  total: number;
  productos: VisualSearchProduct[];
}

export interface VisualSearchState {
  queryImageUrl: string;
  response: VisualSearchResponse;
}
export type PredictionTrend =
  | 'ALTA'
  | 'MEDIA'
  | 'BAJA';

export interface PredictionModel {
  nombre: string;
  version: string;
  tipo: string;
  pesos: Record<string, number>;
}

export interface PredictionPeriod {
  dias: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface PredictionSummary {
  totalEventos: number;
  scoreTotal: number;
  usuariosIdentificados: number;
  sesionesAnalizadas: number;
  productosAnalizados: number;
  categoriasAnalizadas: number;
}

export interface ProductPrediction {
  posicion: number;
  productoId: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  tiendaId: number;
  tiendaNombre: string;
  score: number;
  totalInteracciones: number;
  eventos: Record<string, number>;
  tendencia: PredictionTrend;
}

export interface CategoryPrediction {
  categoria: string;
  score: number;
  totalInteracciones: number;
  totalProductos: number;
  tendencia: PredictionTrend;
}

export interface PredictionResponse {
  modelo: PredictionModel;
  periodo: PredictionPeriod;
  resumen: PredictionSummary;

  productoConMayorInteres:
    ProductPrediction | null;

  categoriaConMayorInteres:
    CategoryPrediction | null;

  productosConMayorInteres:
    ProductPrediction[];

  categoriasConMayorInteres:
    CategoryPrediction[];

  distribucionEventos:
    Record<string, number>;
}
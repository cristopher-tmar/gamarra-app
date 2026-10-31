export enum BehaviorEventType {
  PRODUCTO_VISTO =
    'PRODUCTO_VISTO',

  FAVORITO_AGREGADO =
    'FAVORITO_AGREGADO',

  FAVORITO_ELIMINADO =
    'FAVORITO_ELIMINADO',

  BUSQUEDA_TEXTO =
    'BUSQUEDA_TEXTO',

  BUSQUEDA_VISUAL =
    'BUSQUEDA_VISUAL',

  RESULTADO_SELECCIONADO =
    'RESULTADO_SELECCIONADO',
}

export interface RegisterBehaviorEventRequest {
  tipo: BehaviorEventType;
  sessionId: string;
  productoId?: number;
  terminoBusqueda?: string;
  metadata?: Record<string, unknown>;
}

export interface RegisteredBehaviorEvent {
  id: number;
  tipo: BehaviorEventType;
  usuarioId: number | null;
  productoId: number | null;
  sessionId: string;
  terminoBusqueda: string | null;
  metadata: Record<string, unknown> | null;
  fechaEvento: string;
}

export interface RegisterBehaviorEventResponse {
  mensaje: string;
  evento: RegisteredBehaviorEvent;
}

export interface BehaviorEventData {
  tipo: BehaviorEventType;
  productoId?: number;
  terminoBusqueda?: string;
  metadata?: Record<string, unknown>;
}
import {
  CatalogProduct,
} from '@features/catalog/models/catalog.models';

export interface FavoriteItem {
  id: number;
  fechaCreacion: string;
  producto: CatalogProduct;
}

export interface FavoritesResponse {
  mensaje: string;
  total: number;
  favoritos: FavoriteItem[];
}

export interface AddFavoriteResponse {
  mensaje: string;
  favorito: {
    id: number;
    usuarioId: number;
    productoId: number;
    fechaCreacion: string;
  };
}

export interface RemoveFavoriteResponse {
  mensaje: string;
  productoId: number;
}
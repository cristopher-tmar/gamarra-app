import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import {
    CatalogQuery,
    CatalogResponse,
    ProductDetailResponse,
} from '@features/catalog/models/catalog.models';

@Injectable({
    providedIn: 'root',
})
export class CatalogService {
    private readonly apiUrl =
        `${environment.apiUrl}/catalogo`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    getCatalog(
        query: CatalogQuery = {},
    ): Observable<CatalogResponse> {
        let params = new HttpParams();

        if (query.pagina !== undefined) {
            params = params.set(
                'pagina',
                query.pagina,
            );
        }

        if (query.limite !== undefined) {
            params = params.set(
                'limite',
                query.limite,
            );
        }

        if (query.buscar) {
            params = params.set(
                'buscar',
                query.buscar,
            );
        }

        if (query.categoria) {
            params = params.set(
                'categoria',
                query.categoria,
            );
        }

        if (query.tiendaId !== undefined) {
            params = params.set(
                'tiendaId',
                query.tiendaId,
            );
        }

        return this.http.get<CatalogResponse>(
            this.apiUrl,
            {
                params,
            },
        );
    }

    getProductDetail(
        productId: number,
    ): Observable<ProductDetailResponse> {
        return this.http.get<ProductDetailResponse>(
            `${this.apiUrl}/${productId}`,
        );
    }
}
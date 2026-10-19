import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import {
    VisualSearchResponse,
    VisualSearchState,
} from '@features/visual-search/models/visual-search.models';

@Injectable({
    providedIn: 'root',
})
export class VisualSearchService {
    private readonly endpoint =
        `${environment.apiUrl}/catalogo/busqueda-visual`;

    private currentState?: VisualSearchState;

    constructor(
        private readonly http: HttpClient,
    ) { }

    search(
        file: File,
    ): Observable<VisualSearchResponse> {
        const formData = new FormData();

        formData.append(
            'archivo',
            file,
            file.name,
        );

        const params = new HttpParams()
            .set('limite', 12)
            .set('similitudMinima', 0.8);

        return this.http.post<VisualSearchResponse>(
            this.endpoint,
            formData,
            {
                params,
            },
        );
    }

    setState(
        state: VisualSearchState,
    ): void {
        this.currentState = state;
    }

    getState(): VisualSearchState | undefined {
        return this.currentState;
    }

    clearState(): void {
        if (this.currentState?.queryImageUrl) {
            URL.revokeObjectURL(
                this.currentState.queryImageUrl,
            );
        }

        this.currentState = undefined;
    }
}
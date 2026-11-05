import {
  Injectable,
} from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import {
  Observable,
} from 'rxjs';

import {
  environment,
} from '@environments/environment';
import {
  PredictionResponse,
} from '@features/dashboard/models/prediction.models';

@Injectable({
  providedIn: 'root',
})
export class PredictionsService {
  private readonly apiUrl =
    `${environment.apiUrl}/predicciones`;

  constructor(
    private readonly http:
      HttpClient,
  ) {}

  getSummary(
    days: number = 30,
  ): Observable<PredictionResponse> {
    const params =
      new HttpParams().set(
        'dias',
        days.toString(),
      );

    return this.http.get<PredictionResponse>(
      `${this.apiUrl}/resumen`,
      {
        params,
      },
    );
  }
}

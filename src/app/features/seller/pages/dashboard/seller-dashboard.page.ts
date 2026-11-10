import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  finalize,
} from 'rxjs';
import {
  addIcons,
} from 'ionicons';
import {
  alertCircleOutline,
  barChartOutline,
  calendarOutline,
  cubeOutline,
  flameOutline,
  logoWhatsapp,
  refreshOutline,
  trendingUpOutline,
} from 'ionicons/icons';

import {
  PredictionResponse,
} from '@features/dashboard/models/prediction.models';
import {
  PredictionsService,
} from '@features/dashboard/services/predictions';

@Component({
  selector:
    'app-seller-dashboard',
  templateUrl:
    './seller-dashboard.page.html',
  styleUrls: [
    './seller-dashboard.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
  ],
})
export class SellerDashboardPage
  implements OnInit {
  prediction?: PredictionResponse;

  loading = true;
  hasError = false;
  selectedDays = 30;

  readonly modelMetrics = [
    {
      label: 'MAE',
      value: '6.80',
      detail:
        'Error absoluto medio',
    },
    {
      label: 'RMSE',
      value: '16.35',
      detail:
        'Raíz del error cuadrático',
    },
  ];

  readonly calendarContext = {
    season: 'Primavera',
    campaign:
      'Campaña de fin de año',
    projection:
      '+24%',
  };

  constructor(
    private readonly predictionsService:
      PredictionsService,
    private readonly router:
      Router,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
  ) {
    addIcons({
      alertCircleOutline,
      barChartOutline,
      calendarOutline,
      cubeOutline,
      flameOutline,
      logoWhatsapp,
      refreshOutline,
      trendingUpOutline,
    });
  }

  ngOnInit(): void {
    this.loadPrediction();
  }

  loadPrediction(): void {
    this.loading = true;
    this.hasError = false;

    this.predictionsService
      .getSummary(
        this.selectedDays,
      )
      .pipe(
        finalize(() => {
          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.prediction = response;
        },
        error: () => {
          this.hasError = true;
        },
      });
  }

  changePeriod(
    days: number,
  ): void {
    if (
      this.selectedDays === days ||
      this.loading
    ) {
      return;
    }

    this.selectedDays = days;
    this.loadPrediction();
  }

  openProduct(
    productId: number,
  ): void {
    void this.router.navigate([
      '/catalogo',
      productId,
    ]);
  }

}
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
  arrowBackOutline,
  barChartOutline,
  flameOutline,
  peopleOutline,
  refreshOutline,
  shirtOutline,
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
    'app-prediction-dashboard',
  templateUrl:
    './prediction-dashboard.page.html',
  styleUrls: [
    './prediction-dashboard.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
  ],
})
export class PredictionDashboardPage
  implements OnInit {
  prediction?: PredictionResponse;

  loading = true;
  hasError = false;

  selectedDays = 30;

  constructor(
    private readonly predictionsService:
      PredictionsService,
    private readonly router:
      Router,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
  ) {
    addIcons({
      arrowBackOutline,
      barChartOutline,
      flameOutline,
      peopleOutline,
      refreshOutline,
      shirtOutline,
      trendingUpOutline,
    });
  }

  ngOnInit(): void {
    this.loadPrediction();
  }

  ionViewWillEnter(): void {
    if (!this.loading) {
      this.loadPrediction();
    }
  }

  get summaryCards() {
    return [
      {
        label: 'Interacciones',
        value:
          this.prediction?.resumen
            .totalEventos ?? 0,
        icon: 'bar-chart-outline',
      },
      {
        label: 'Sesiones',
        value:
          this.prediction?.resumen
            .sesionesAnalizadas ?? 0,
        icon: 'people-outline',
      },
      {
        label: 'Productos analizados',
        value:
          this.prediction?.resumen
            .productosAnalizados ?? 0,
        icon: 'shirt-outline',
      },
      {
        label: 'Score total',
        value:
          this.prediction?.resumen
            .scoreTotal ?? 0,
        icon: 'trending-up-outline',
      },
    ];
  }

  loadPrediction(): void {
    if (this.loading && this.prediction) {
      return;
    }

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

  goBack(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }
}
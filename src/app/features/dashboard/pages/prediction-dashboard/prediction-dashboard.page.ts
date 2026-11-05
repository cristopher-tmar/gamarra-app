import {
  Component,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  addIcons,
} from 'ionicons';
import {
  arrowBackOutline,
  barChartOutline,
  flameOutline,
  peopleOutline,
  shirtOutline,
  trendingUpOutline,
} from 'ionicons/icons';

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
export class PredictionDashboardPage {
  readonly summaryCards = [
    {
      label: 'Interacciones',
      value: '0',
      icon: 'bar-chart-outline',
    },
    {
      label: 'Sesiones',
      value: '0',
      icon: 'people-outline',
    },
    {
      label: 'Productos analizados',
      value: '0',
      icon: 'shirt-outline',
    },
    {
      label: 'Score total',
      value: '0',
      icon: 'trending-up-outline',
    },
  ];

  constructor(
    private readonly router:
      Router,
  ) {
    addIcons({
      arrowBackOutline,
      barChartOutline,
      flameOutline,
      peopleOutline,
      shirtOutline,
      trendingUpOutline,
    });
  }

  goBack(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }
}
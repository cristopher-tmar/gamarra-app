import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

import { UiBottomNavComponent } from '@shared/components/ui-bottom-nav/ui-bottom-nav.component';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  imports: [
    IonRouterOutlet,
    UiBottomNavComponent,
  ],
})
export class PublicLayoutComponent {}
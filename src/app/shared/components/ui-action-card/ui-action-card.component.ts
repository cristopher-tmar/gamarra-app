import {
  booleanAttribute,
  Component,
  Input,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

export type UiActionCardVariant =
  | 'brand'
  | 'accent'
  | 'neutral';

@Component({
  selector: 'app-ui-action-card',
  templateUrl: './ui-action-card.component.html',
  styleUrls: ['./ui-action-card.component.scss'],
  imports: [
    IonIcon,
  ],
})
export class UiActionCardComponent {
  @Input({
    required: true,
  })
  title = '';

  @Input()
  description?: string;

  @Input()
  icon?: string;

  @Input()
  variant: UiActionCardVariant = 'brand';

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  @Input({
    transform: booleanAttribute,
  })
  showArrow = true;

  @Input()
  ariaLabel?: string;

  constructor() {
    addIcons({
      arrowForwardOutline,
    });
  }
}

import {
  booleanAttribute,
  Component,
  Input,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';

export type UiBadgeVariant =
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type UiBadgeSize =
  | 'small'
  | 'medium';

@Component({
  selector: 'app-ui-badge',
  templateUrl: './ui-badge.component.html',
  styleUrls: ['./ui-badge.component.scss'],
  imports: [
    IonIcon,
  ],
})
export class UiBadgeComponent {
  @Input({
    required: true,
  })
  label = '';

  @Input()
  variant: UiBadgeVariant = 'neutral';

  @Input()
  size: UiBadgeSize = 'small';

  @Input()
  icon?: string;

  @Input({
    transform: booleanAttribute,
  })
  showDot = false;
}
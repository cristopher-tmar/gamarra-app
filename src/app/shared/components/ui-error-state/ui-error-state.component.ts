import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  refreshOutline,
} from 'ionicons/icons';
import { UiButtonComponent } from '../ui-button/ui-button.component';

export type UiErrorStateVariant =
  | 'error'
  | 'warning'
  | 'offline';

@Component({
  selector: 'app-ui-error-state',
  templateUrl: './ui-error-state.component.html',
  styleUrls: ['./ui-error-state.component.scss'],
  imports: [
    IonIcon,
    UiButtonComponent,
  ],
})
export class UiErrorStateComponent {
  @Input({
    required: true,
  })
  title = '';

  @Input()
  description?: string;

  @Input()
  icon = 'alert-circle-outline';

  @Input()
  variant: UiErrorStateVariant = 'error';

  @Input()
  actionLabel = 'Intentar nuevamente';

  @Input({
    transform: booleanAttribute,
  })
  showAction = true;

  @Input({
    transform: booleanAttribute,
  })
  compact = false;

  @Input({
    transform: booleanAttribute,
  })
  loading = false;

  @Output()
  retry = new EventEmitter<void>();

  constructor() {
    addIcons({
      alertCircleOutline,
      refreshOutline,
    });
  }

  handleRetry(): void {
    if (this.loading) {
      return;
    }

    this.retry.emit();
  }
}
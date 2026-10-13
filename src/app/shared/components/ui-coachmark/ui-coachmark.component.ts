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
  cameraOutline,
  closeOutline,
} from 'ionicons/icons';
import { UiButtonComponent } from '../ui-button/ui-button.component';

export type UiCoachmarkPosition =
  | 'top'
  | 'bottom';

@Component({
  selector: 'app-ui-coachmark',
  templateUrl: './ui-coachmark.component.html',
  styleUrls: ['./ui-coachmark.component.scss'],
  imports: [
    IonIcon,
    UiButtonComponent,
  ],
})
export class UiCoachmarkComponent {
  @Input({
    required: true,
  })
  title = '';

  @Input()
  description?: string;

  @Input()
  icon = 'camera-outline';

  @Input()
  actionLabel = 'Entendido';

  @Input()
  position: UiCoachmarkPosition = 'bottom';

  @Input({
    transform: booleanAttribute,
  })
  visible = false;

  @Input({
    transform: booleanAttribute,
  })
  showClose = true;

  @Output()
  dismissed = new EventEmitter<void>();

  constructor() {
    addIcons({
      cameraOutline,
      closeOutline,
    });
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  handleBackdropClick(): void {
    this.dismiss();
  }

  handleCardClick(
    event: Event,
  ): void {
    event.stopPropagation();
  }
}
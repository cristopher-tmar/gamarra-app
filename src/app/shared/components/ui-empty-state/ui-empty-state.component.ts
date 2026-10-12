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
  addOutline,
  searchOutline,
} from 'ionicons/icons';
import { UiButtonComponent } from '../ui-button/ui-button.component';

export type UiEmptyStateVariant =
  | 'neutral'
  | 'brand'
  | 'accent';

@Component({
  selector: 'app-ui-empty-state',
  templateUrl: './ui-empty-state.component.html',
  styleUrls: ['./ui-empty-state.component.scss'],
  imports: [
    IonIcon,
    UiButtonComponent,
  ],
})
export class UiEmptyStateComponent {
  @Input({
    required: true,
  })
  title = '';

  @Input()
  description?: string;

  @Input()
  icon = 'search-outline';

  @Input()
  variant: UiEmptyStateVariant = 'neutral';

  @Input()
  actionLabel?: string;

  @Input()
  actionIcon?: string;

  @Input({
    transform: booleanAttribute,
  })
  compact = false;

  @Output()
  actionClick = new EventEmitter<void>();

  constructor() {
    addIcons({
      addOutline,
      searchOutline,
    });
  }

  handleAction(): void {
    this.actionClick.emit();
  }
}
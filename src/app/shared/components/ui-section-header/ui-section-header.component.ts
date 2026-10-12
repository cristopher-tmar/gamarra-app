import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ui-section-header',
  templateUrl: './ui-section-header.component.html',
  styleUrls: ['./ui-section-header.component.scss'],
  imports: [
    IonIcon,
  ],
})
export class UiSectionHeaderComponent {
  @Input({
    required: true,
  })
  title = '';

  @Input()
  description?: string;

  @Input()
  actionLabel?: string;

  @Input()
  actionIcon = 'arrow-forward-outline';

  @Input({
    transform: booleanAttribute,
  })
  showAction = false;

  @Input({
    transform: booleanAttribute,
  })
  compact = false;

  @Output()
  actionClick = new EventEmitter<void>();

  constructor() {
    addIcons({
      arrowForwardOutline,
    });
  }

  handleAction(): void {
    this.actionClick.emit();
  }
}
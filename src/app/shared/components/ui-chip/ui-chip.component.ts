import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';

export type UiChipVariant =
  | 'brand'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';

export type UiChipSize =
  | 'small'
  | 'medium';

@Component({
  selector: 'app-ui-chip',
  templateUrl: './ui-chip.component.html',
  styleUrls: ['./ui-chip.component.scss'],
  imports: [
    IonIcon,
  ],
})
export class UiChipComponent {
  @Input({
    required: true,
  })
  label = '';

  @Input()
  icon?: string;

  @Input()
  variant: UiChipVariant = 'neutral';

  @Input()
  size: UiChipSize = 'medium';

  @Input({
    transform: booleanAttribute,
  })
  selected = false;

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  @Input({
    transform: booleanAttribute,
  })
  interactive = true;

  @Output()
  selectedChange =
    new EventEmitter<boolean>();

  @Output()
  chipClick =
    new EventEmitter<void>();

  handleClick(): void {
    if (
      this.disabled ||
      !this.interactive
    ) {
      return;
    }

    this.selected = !this.selected;

    this.selectedChange.emit(
      this.selected,
    );

    this.chipClick.emit();
  }
}

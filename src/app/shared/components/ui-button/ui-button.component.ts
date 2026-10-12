import {
  booleanAttribute,
  Component,
  Input,
} from '@angular/core';

export type UiButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'danger';

export type UiButtonSize =
  | 'small'
  | 'medium'
  | 'large';

export type UiButtonType =
  | 'button'
  | 'submit'
  | 'reset';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  imports: [],
})
export class UiButtonComponent {
  @Input()
  variant: UiButtonVariant = 'primary';

  @Input()
  size: UiButtonSize = 'large';

  @Input()
  type: UiButtonType = 'button';

  @Input({
    transform: booleanAttribute,
  })
  fullWidth = true;

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  @Input({
    transform: booleanAttribute,
  })
  loading = false;

  @Input()
  ariaLabel?: string;
}
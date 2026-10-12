import {
  booleanAttribute,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  eyeOffOutline,
  eyeOutline,
} from 'ionicons/icons';

export type UiInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

@Component({
  selector: 'app-ui-input',
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss'],
  imports: [
    IonIcon,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => UiInputComponent,
      ),
      multi: true,
    },
  ],
})
export class UiInputComponent
  implements ControlValueAccessor {
  @Input()
  label = '';

  @Input()
  placeholder = '';

  @Input()
  type: UiInputType = 'text';

  @Input()
  name?: string;

  @Input()
  autocomplete?: string;

  @Input()
  inputMode?: string;

  @Input()
  icon?: string;

  @Input()
  helpText?: string;

  @Input()
  errorMessage?: string;

  @Input()
  min?: number;

  @Input()
  max?: number;

  @Input()
  step?: number | string;

  @Input()
  maxLength?: number;

  @Input({
    transform: booleanAttribute,
  })
  required = false;

  @Input({
    transform: booleanAttribute,
  })
  readonly = false;

  value = '';

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  passwordVisible = false;

  private onChange:
    (value: string) => void = () => { };

  private onTouched:
    () => void = () => { };

  constructor() {
    addIcons({
      eyeOutline,
      eyeOffOutline,
    });
  }

  get resolvedType(): UiInputType {
    if (
      this.type === 'password' &&
      this.passwordVisible
    ) {
      return 'text';
    }

    return this.type;
  }

  get hasError(): boolean {
    return Boolean(this.errorMessage);
  }

  writeValue(
    value: string | number | null,
  ): void {
    this.value =
      value === null ||
        value === undefined
        ? ''
        : String(value);
  }

  registerOnChange(
    callback: (value: string) => void,
  ): void {
    this.onChange = callback;
  }

  registerOnTouched(
    callback: () => void,
  ): void {
    this.onTouched = callback;
  }

  setDisabledState(
    disabled: boolean,
  ): void {
    this.disabled = disabled;
  }

  handleInput(
    event: Event,
  ): void {
    const element =
      event.target as HTMLInputElement;

    this.value = element.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    if (
      this.disabled ||
      this.readonly
    ) {
      return;
    }

    this.passwordVisible =
      !this.passwordVisible;
  }
}
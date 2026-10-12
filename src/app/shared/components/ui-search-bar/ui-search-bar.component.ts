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
  closeCircleOutline,
  searchOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-ui-search-bar',
  templateUrl: './ui-search-bar.component.html',
  styleUrls: ['./ui-search-bar.component.scss'],
  imports: [
    IonIcon,
  ],
})
export class UiSearchBarComponent {
  @Input()
  value = '';

  @Input()
  placeholder = 'Buscar productos';

  @Input()
  ariaLabel = 'Buscar productos';

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  @Input({
    transform: booleanAttribute,
  })
  showCamera = false;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  search = new EventEmitter<string>();

  @Output()
  cameraClick = new EventEmitter<void>();

  constructor() {
    addIcons({
      cameraOutline,
      closeCircleOutline,
      searchOutline,
    });
  }

  handleInput(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    this.search.emit(this.value.trim());
  }

  clearSearch(): void {
    if (this.disabled) {
      return;
    }

    this.value = '';
    this.valueChange.emit('');
    this.search.emit('');
  }

  openCamera(): void {
    if (this.disabled) {
      return;
    }

    this.cameraClick.emit();
  }
}
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  DecimalPipe,
  NgOptimizedImage,
} from '@angular/common';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  imageOutline,
  storefrontOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-ui-product-card',
  templateUrl: './ui-product-card.component.html',
  styleUrls: ['./ui-product-card.component.scss'],
  imports: [
    DecimalPipe,
    NgOptimizedImage,
    IonIcon,
  ],
})
export class UiProductCardComponent {
  @Input({
    required: true,
  })
  productId!: number;

  @Input({
    required: true,
  })
  name = '';

  @Input({
    required: true,
  })
  price = 0;

  @Input()
  imageUrl?: string | null;

  @Input()
  storeName?: string;

  @Input()
  category?: string;

  @Input()
  stock?: number;

  @Input()
  similarityPercentage?: number;

  @Input({
    transform: booleanAttribute,
  })
  favorite = false;

  @Input({
    transform: booleanAttribute,
  })
  disabled = false;

  @Input({
    transform: booleanAttribute,
  })
  priorityImage = false;

  @Output()
  productClick =
    new EventEmitter<number>();

  @Output()
  favoriteChange =
    new EventEmitter<boolean>();

  constructor() {
    addIcons({
      heart,
      heartOutline,
      imageOutline,
      storefrontOutline,
    });
  }

  get available(): boolean {
    return this.stock === undefined ||
      this.stock > 0;
  }

  get similarityLabel(): string | null {
    if (
      this.similarityPercentage === undefined
    ) {
      return null;
    }

    if (this.similarityPercentage >= 90) {
      return 'Muy parecido';
    }

    if (this.similarityPercentage >= 80) {
      return 'Parecido';
    }

    return 'También podría gustarte';
  }

  openProduct(): void {
    if (this.disabled) {
      return;
    }

    this.productClick.emit(this.productId);
  }

  toggleFavorite(
    event: Event,
  ): void {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.favorite = !this.favorite;

    this.favoriteChange.emit(
      this.favorite,
    );
  }
}
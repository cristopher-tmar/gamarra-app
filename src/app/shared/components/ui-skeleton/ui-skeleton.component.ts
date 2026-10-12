import {
  Component,
  Input,
} from '@angular/core';

export type UiSkeletonVariant =
  | 'text'
  | 'circle'
  | 'rectangle'
  | 'product-card';

@Component({
  selector: 'app-ui-skeleton',
  templateUrl: './ui-skeleton.component.html',
  styleUrls: ['./ui-skeleton.component.scss'],
  imports: [],
})
export class UiSkeletonComponent {
  @Input()
  variant: UiSkeletonVariant = 'text';

  @Input()
  width = '100%';

  @Input()
  height?: string;

  @Input()
  lines = 1;

  get normalizedLines(): number[] {
    const totalLines = Math.max(
      1,
      Math.min(this.lines, 10),
    );

    return Array.from(
      {
        length: totalLines,
      },
      (_, index) => index,
    );
  }

  get resolvedHeight(): string {
    if (this.height) {
      return this.height;
    }

    switch (this.variant) {
      case 'circle':
        return this.width;

      case 'rectangle':
        return '120px';

      case 'text':
      default:
        return '16px';
    }
  }
}
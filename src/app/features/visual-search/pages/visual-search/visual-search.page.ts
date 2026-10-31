import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  finalize,
} from 'rxjs';
import {
  addIcons,
} from 'ionicons';
import {
  cameraOutline,
  closeOutline,
  cloudUploadOutline,
  imageOutline,
} from 'ionicons/icons';

import {
  BehaviorEventType,
} from '@features/behavior-events/models/behavior-event.models';
import {
  BehaviorEventsService,
} from '@features/behavior-events/services/behavior-events';
import {
  VisualSearchService,
} from '@features/visual-search/services/visual-search';
import {
  UiButtonComponent,
} from '@shared/components/ui-button/ui-button.component';
import {
  UiToastService,
} from '@shared/services/ui-toast';

@Component({
  selector: 'app-visual-search',
  templateUrl:
    './visual-search.page.html',
  styleUrls: [
    './visual-search.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
    UiButtonComponent,
  ],
})
export class VisualSearchPage {
  selectedFile?: File;
  selectedImageUrl?: string;

  loading = false;

  constructor(
    private readonly visualSearchService:
      VisualSearchService,
    private readonly behaviorEventsService:
      BehaviorEventsService,
    private readonly uiToast:
      UiToastService,
    private readonly router:
      Router,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
  ) {
    addIcons({
      cameraOutline,
      closeOutline,
      cloudUploadOutline,
      imageOutline,
    });
  }

  selectImage(
    input: HTMLInputElement,
  ): void {
    if (this.loading) {
      return;
    }

    input.click();
  }

  handleFileSelection(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      input.value = '';

      void this.uiToast.warning(
        'Selecciona una imagen JPG, PNG o WebP',
      );

      return;
    }

    const maximumSize =
      10 * 1024 * 1024;

    if (
      file.size > maximumSize
    ) {
      input.value = '';

      void this.uiToast.warning(
        'La imagen no debe superar los 10 MB',
      );

      return;
    }

    if (this.selectedImageUrl) {
      URL.revokeObjectURL(
        this.selectedImageUrl,
      );
    }

    this.selectedFile = file;

    this.selectedImageUrl =
      URL.createObjectURL(file);
  }

  removeImage(
    input: HTMLInputElement,
  ): void {
    if (this.loading) {
      return;
    }

    if (this.selectedImageUrl) {
      URL.revokeObjectURL(
        this.selectedImageUrl,
      );
    }

    this.selectedFile = undefined;
    this.selectedImageUrl = undefined;
    input.value = '';
  }

  searchSimilarProducts(): void {
    if (
      !this.selectedFile ||
      !this.selectedImageUrl ||
      this.loading
    ) {
      void this.uiToast.warning(
        'Selecciona una imagen para continuar',
      );

      return;
    }

    const selectedFile =
      this.selectedFile;

    const selectedImageUrl =
      this.selectedImageUrl;

    this.loading = true;

    this.visualSearchService
      .search(selectedFile)
      .pipe(
        finalize(() => {
          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.visualSearchService
            .setState({
              queryImageUrl:
                selectedImageUrl,
              response,
            });

          this.behaviorEventsService
            .register({
              tipo:
                BehaviorEventType
                  .BUSQUEDA_VISUAL,
              metadata: {
                origen:
                  'busqueda_visual',
                mimeType:
                  selectedFile.type,
                tamanioBytes:
                  selectedFile.size,
                totalResultados:
                  response.total,
                modelo:
                  response.consulta
                    .modelo,
                dimension:
                  response.consulta
                    .dimension,
                tiempoProcesamientoMs:
                  response.consulta
                    .tiempoProcesamientoMs,
                similitudMinima:
                  response
                    .criterioBusqueda
                    .similitudMinima,
                similitudMinimaPorcentaje:
                  response
                    .criterioBusqueda
                    .similitudMinimaPorcentaje,
              },
            });

          void this.router.navigate([
            '/busqueda-visual/resultados',
          ]);
        },
        error: () => {
          void this.uiToast.error(
            'No pudimos buscar prendas similares',
          );
        },
      });
  }
}
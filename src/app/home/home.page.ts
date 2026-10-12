import { Component } from '@angular/core';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  bagHandleOutline,
  barcodeOutline,
  cameraOutline,
  cashOutline,
  cloudUploadOutline,
  gridOutline,
  lockClosedOutline,
  mailOutline,
  shirtOutline,
} from 'ionicons/icons';
import { UiButtonComponent } from '../shared/components/ui-button/ui-button.component';
import { UiActionCardComponent } from '../shared/components/ui-action-card/ui-action-card.component';
import { UiInputComponent } from '../shared/components/ui-input/ui-input.component';
import { UiSearchBarComponent } from '../shared/components/ui-search-bar/ui-search-bar.component';
import { UiChipComponent } from '../shared/components/ui-chip/ui-chip.component';
import { UiProductCardComponent } from '../shared/components/ui-product-card/ui-product-card.component';
import { UiBadgeComponent } from '../shared/components/ui-badge/ui-badge.component';
import { UiSkeletonComponent } from '../shared/components/ui-skeleton/ui-skeleton.component';
import { UiEmptyStateComponent } from '../shared/components/ui-empty-state/ui-empty-state.component';
import { UiErrorStateComponent } from '../shared/components/ui-error-state/ui-error-state.component';
import { UiSectionHeaderComponent } from '../shared/components/ui-section-header/ui-section-header.component';
import { UiToastService } from '../shared/services/ui-toast';
import { UiConfirmService } from '../shared/services/ui-confirm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    UiButtonComponent,
    UiActionCardComponent,
    UiInputComponent,
    UiSearchBarComponent,
    UiChipComponent,
    UiProductCardComponent,
    UiBadgeComponent,
    UiSkeletonComponent,
    UiEmptyStateComponent,
    UiErrorStateComponent,
    UiSectionHeaderComponent,
  ],
})
export class HomePage {
  constructor(
    private readonly uiToast: UiToastService,
    private readonly uiConfirm: UiConfirmService,
  ) {
    addIcons({
      arrowForwardOutline,
      bagHandleOutline,
      barcodeOutline,
      cameraOutline,
      cashOutline,
      cloudUploadOutline,
      gridOutline,
      lockClosedOutline,
      mailOutline,
      shirtOutline,
    });
  }

  showSuccessToast(): void {
    void this.uiToast.success(
      'Producto guardado correctamente',
    );
  }

  showErrorToast(): void {
    void this.uiToast.error(
      'No se pudo guardar el producto',
    );
  }

  showWarningToast(): void {
    void this.uiToast.warning(
      'Quedan pocas unidades disponibles',
    );
  }

  showInfoToast(): void {
    void this.uiToast.info(
      'La imagen está siendo procesada',
    );
  }

  //

  async showConfirmModal(): Promise<void> {
    const confirmed =
      await this.uiConfirm.confirm({
        title: 'Guardar cambios',
        message:
          '¿Deseas guardar los cambios realizados en este producto?',
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
      });

    if (confirmed) {
      void this.uiToast.success(
        'Cambios guardados correctamente',
      );
    }
  }

  async showDeleteModal(): Promise<void> {
    const confirmed =
      await this.uiConfirm.confirmDelete(
        'este producto',
      );

    if (confirmed) {
      void this.uiToast.success(
        'Producto eliminado correctamente',
      );
    }
  }



}
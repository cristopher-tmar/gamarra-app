import {
  Component,
} from '@angular/core';
import {
  FormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  addIcons,
} from 'ionicons';
import {
  checkmarkCircleOutline,
  documentTextOutline,
  imagesOutline,
  informationCircleOutline,
  saveOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import {
  SellerDemoStoreService,
} from '@features/seller/services/seller-demo-store';
import {
  UiToastService,
} from '@shared/services/ui-toast';

@Component({
  selector: 'app-seller-consent',
  templateUrl:
    './seller-consent.page.html',
  styleUrls: [
    './seller-consent.page.scss',
  ],
  imports: [
    FormsModule,
    IonContent,
    IonIcon,
  ],
})
export class SellerConsentPage {
  imageProcessingConsent: boolean;
  analyticsConsent: boolean;
  academicUseConsent: boolean;

  saving = false;
  saved = false;

  constructor(
    private readonly demoStore:
      SellerDemoStoreService,
    private readonly uiToast:
      UiToastService,
  ) {
    const consent =
      this.demoStore.consent();

    this.imageProcessingConsent =
      consent.imageProcessingConsent;
    this.analyticsConsent =
      consent.analyticsConsent;
    this.academicUseConsent =
      consent.academicUseConsent;

    addIcons({
      checkmarkCircleOutline,
      documentTextOutline,
      imagesOutline,
      informationCircleOutline,
      saveOutline,
      shieldCheckmarkOutline,
    });
  }

  get allRequiredAccepted(): boolean {
    return (
      this.imageProcessingConsent &&
      this.analyticsConsent
    );
  }

  saveConsent(): void {
    if (
      !this.allRequiredAccepted ||
      this.saving
    ) {
      return;
    }

    this.saving = true;
    this.saved = false;

    try {
      this.demoStore.saveConsent({
        imageProcessingConsent:
          this.imageProcessingConsent,
        analyticsConsent:
          this.analyticsConsent,
        academicUseConsent:
          this.academicUseConsent,
      });

      this.saved = true;

      void this.uiToast.success(
        // MODO DEMO: 'Preferencias guardadas (modo demo)',
        'Preferencias guardadas correctamente',
      );
    } catch {
      void this.uiToast.error(
        'No pudimos guardar tus preferencias',
      );
    } finally {
      this.saving = false;
    }
  }

  get lastUpdated(): string | null {
    const date =
      this.demoStore.consent()
        .fechaModificacion;

    return date
      ? new Date(date).toLocaleString('es-PE')
      : null;
  }
}
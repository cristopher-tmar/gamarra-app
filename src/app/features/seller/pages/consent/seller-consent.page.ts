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
  imageProcessingConsent = true;
  analyticsConsent = true;
  academicUseConsent = true;

  saving = false;
  saved = false;

  constructor() {
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

    window.setTimeout(() => {
      this.saving = false;
      this.saved = true;
    }, 700);
  }
}
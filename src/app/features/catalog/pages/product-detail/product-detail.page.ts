import { Component } from '@angular/core';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  locationOutline,
  logoWhatsapp,
  storefrontOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  imports: [
    IonContent,
    IonIcon,
  ],
})
export class ProductDetailPage {

  readonly whatsappUrl =
  'https://wa.me/51999888777?text=Hola%2C%20vi%20el%20producto%20Polo%20Basement%20cuello%20camisero%20beige%20en%20Gamarra%20App.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F';

  constructor() {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      locationOutline,
      logoWhatsapp,
      storefrontOutline,
    });
  }
}
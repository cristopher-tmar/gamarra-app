import { Injectable } from '@angular/core';
import {
    ToastController,
    ToastOptions,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
    alertCircleOutline,
    checkmarkCircleOutline,
    closeOutline,
    informationCircleOutline,
    warningOutline,
} from 'ionicons/icons';

@Injectable({
    providedIn: 'root',
})
export class UiToastService {
    constructor(
        private readonly toastController: ToastController,
    ) {
        addIcons({
            alertCircleOutline,
            checkmarkCircleOutline,
            closeOutline,
            informationCircleOutline,
            warningOutline,
        });
    }

    success(
        message: string,
        duration = 3000,
    ): Promise<void> {
        return this.present({
            message,
            duration,
            icon: 'checkmark-circle-outline',
            cssClass: [
                'gamarra-toast',
                'gamarra-toast--success',
            ],
        });
    }

    error(
        message: string,
        duration = 4500,
    ): Promise<void> {
        return this.present({
            message,
            duration,
            icon: 'alert-circle-outline',
            cssClass: [
                'gamarra-toast',
                'gamarra-toast--error',
            ],
        });
    }

    warning(
        message: string,
        duration = 4000,
    ): Promise<void> {
        return this.present({
            message,
            duration,
            icon: 'warning-outline',
            cssClass: [
                'gamarra-toast',
                'gamarra-toast--warning',
            ],
        });
    }

    info(
        message: string,
        duration = 3000,
    ): Promise<void> {
        return this.present({
            message,
            duration,
            icon: 'information-circle-outline',
            cssClass: [
                'gamarra-toast',
                'gamarra-toast--info',
            ],
        });
    }

    private async present(
        options: ToastOptions,
    ): Promise<void> {
        const toast =
            await this.toastController.create({
                position: 'bottom',
                ...options,
                buttons: [
                    {
                        icon: 'close-outline',
                        role: 'cancel',
                    },
                ],
            });

        await toast.present();
    }
}
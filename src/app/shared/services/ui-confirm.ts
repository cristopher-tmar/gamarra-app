import { Injectable } from '@angular/core';
import {
    AlertController,
    AlertOptions,
} from '@ionic/angular';

export interface UiConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UiConfirmService {
    constructor(
        private readonly alertController: AlertController,
    ) { }

    async confirm(
        options: UiConfirmOptions,
    ): Promise<boolean> {
        return new Promise<boolean>(
            async (resolve) => {
                const alertOptions: AlertOptions = {
                    header: options.title,
                    message: options.message,
                    cssClass: 'gamarra-confirm',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text:
                                options.cancelText ??
                                'Cancelar',
                            role: 'cancel',
                            cssClass:
                                'gamarra-confirm__cancel',
                            handler: () => {
                                resolve(false);
                            },
                        },
                        {
                            text:
                                options.confirmText ??
                                'Confirmar',
                            role: 'confirm',
                            cssClass: options.destructive
                                ? 'gamarra-confirm__danger'
                                : 'gamarra-confirm__accept',
                            handler: () => {
                                resolve(true);
                            },
                        },
                    ],
                };

                const alert =
                    await this.alertController.create(
                        alertOptions,
                    );

                await alert.present();

                const result =
                    await alert.onDidDismiss();

                if (
                    result.role !== 'confirm' &&
                    result.role !== 'cancel'
                ) {
                    resolve(false);
                }
            },
        );
    }

    confirmDelete(
        itemName: string,
    ): Promise<boolean> {
        return this.confirm({
            title: 'Eliminar elemento',
            message:
                `¿Deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            destructive: true,
        });
    }
}
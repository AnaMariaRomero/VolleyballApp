import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {

    loadingController = inject(LoadingController);
    toastController = inject(ToastController);
    modalCtrl = inject(ModalController);
    router = inject(Router);

    // para tomar o subir una foto
    async takePicture(promptLabelHeader: string) {
        return await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Prompt,
            promptLabelHeader,
            promptLabelPhoto: 'Seleccionar una imagen',
            promptLabelPicture: 'Tomar una foto'
        });
    }

// ============ Loading ===================
    loading() {
        return this.loadingController.create({spinner: 'crescent'})
    }

// ============ Toast ====================
    async presentToast(optionsToast?: ToastOptions) {
        const toast = await this.toastController.create(optionsToast);
        toast.present();
    }

// ============= Enrutar a cualquier página disponible =========
    routerLink(url: string){
        return this.router.navigateByUrl(url);
    }

// =========== Guarda un elemento en localStorage =============
    saveInLocalStorage(key: string, value: any){
        return localStorage.setItem(key, JSON.stringify(value));
    }

// =========== Obtiene un elemento del localStorage =============
    getFromLocalStorage(key: string){
        return JSON.parse(localStorage.getItem(key));
    }

// ============== Modal ========================
    async presentModal(optionsToast: ModalOptions){
        const modal = await this.modalCtrl.create(optionsToast);
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) return data;
    }

    dismissModal(data?:any){
        return this.modalCtrl.dismiss(data);
    }
}
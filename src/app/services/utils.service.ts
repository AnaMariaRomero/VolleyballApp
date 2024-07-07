import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {

    loadingController = inject(LoadingController);
    toastController = inject(ToastController);
    router = inject(Router);

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

}
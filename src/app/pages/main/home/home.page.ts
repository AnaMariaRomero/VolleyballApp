import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePlayerComponent } from 'src/app/shared/components/add-update-player/add-update-player.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

  // =========== agregar o actualizar jugadora =====
  addUpdatePlayer(){
    this.utilsSvc.presentModal({
      component: AddUpdatePlayerComponent,
      cssClass: 'add-update-modal'
    })
  }

  async getParametros() {
    if(true){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `parametros/categorías`; 

      this.firebaseSvc.getDocument(path).then( res => {
       
        console.log(res)
        // mensaje de bienvenida
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida :)`,
          duration: 1500,
          color: 'tertiary',
          position: "middle",
          icon: 'person-circle-outline'
        })
     
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'tertiary',
          position: "middle",
          icon: 'alert-circle-outline'
        })

       }).finally(() => {
        loading.dismiss();
       })
    }
  }
}

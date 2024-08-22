import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Category } from 'src/app/models/category.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Position } from 'src/app/models/position.model';

@Component({
  selector: 'app-add-update-player',
  templateUrl: './add-update-player.component.html',
  styleUrls: ['./add-update-player.component.scss'],
})
export class AddUpdatePlayerComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl(''),
    numberPlayer: new FormControl(),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    categories: new FormControl('', []),
    positions: new FormControl('', []),
    statisticsPlayer: new FormControl([])
  })
  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  categories = {} as Category [];
  positions = {} as Position [];

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getParamsCategories();
    this.getParamsPositions();
  }

  // =============== tomar o subir una foto =====================
  async takePicture() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de la jugadora')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }


  async submit() {
    if(this.form.valid){
      let path = `users/${this.user.uid}/players`
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // ============ subir la imagen y obtener url
      let data_url = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, data_url);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;
      this.form.value.statisticsPlayer = [];

      // ====== Subir el documento ========
      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Jugadora creada exitosamente. ',
          duration: 1500,
          color: 'tertiary',
          position: "middle",
          icon: 'checkmark-circle-outline'
        });
        
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

  // Obtenemos los parametros/categorias/datos
  async getParamsCategories() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.getParams('categorías').then( res => {

      this.categories = res;     
        
    }).catch(error => {
       console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'tertiary',
        position: "middle",
        icon: 'alert-circle-outline'
      })

     }).finally(() => { loading.dismiss(); });
  }

   // Obtenemos los parametros/categorias/datos
   async getParamsPositions() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.getParams('posiciones').then( res => {

      this.positions = res;     
        
    }).catch(error => {
       console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'tertiary',
        position: "middle",
        icon: 'alert-circle-outline'
      })

     }).finally(() => { loading.dismiss(); });
  }

  // Con esto puedo obtener los datos para las categorías de las jugadoras
  handleChangeCategories(evento) {
    this.form.controls.categories.setValue(evento.target.value);
  }
  handleChangePositions(evento) {
    this.form.controls.positions.setValue(evento.target.value);
  }

}

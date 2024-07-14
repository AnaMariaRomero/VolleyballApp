import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-player',
  templateUrl: './add-update-player.component.html',
  styleUrls: ['./add-update-player.component.scss'],
})
export class AddUpdatePlayerComponent  implements OnInit {

  categories = [
    {
      id: 1,
      name: 'sub 16'
    },
    {
      id: 2,
      name: 'sub 18'
    },
    {
      id: 3,
      name: 'Sub 21'
    },
    {
      id: 4,
      name: 'Sub 23'
    },
    {
      id: 4,
      name: 'Mayores'
    },
  ];

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    categories: new FormControl([])
  })
  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  async submit() {
    if(this.form.valid){
      let path = `users/${this.user.uid}/players`
      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.id;

      // ====== Subir el documento ========
      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utilsSvc.dismissModal({  success: true});

        this.utilsSvc.presentToast({
          message: 'Jugadora creada exitosamente. ',
          duration: 1500,
          color: 'tertiary',
          position: "middle",
          icon: 'checkmark-circle-outline'
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
      })
    }
}

  // Con esto puedo obtener los datos para las categorías de las jugadoras
  handleChange(evento) {
    console.log('Categorías seleccionadas:', JSON.stringify(evento.target.value[0]));
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-match',
  templateUrl: './add-update-match.component.html',
  styleUrls: ['./add-update-match.component.scss'],
})
export class AddUpdateMatchComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    team: new FormControl('',[Validators.required, Validators.minLength(4)]),
    date: new FormControl(''),
    playersId: new FormControl([])
  })
  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  players = {} as Player [];

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getPlayers();
  }

  async submit() {
    if(this.form.valid){
      let path = `users/${this.user.uid}/matches`
      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.id;

      // ====== Subir el documento ========
      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Partido creado exitosamente. ',
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

  // Obtenemos los user/id/players/id/datos -> hasta id quiero
  async getPlayers() {

    const sub = this.firebaseSvc.getPlayers().subscribe({
      next: (res: any) => {
        this.players = res;
        sub.unsubscribe();
      }
    });
  }

  // Con esto puedo obtener el id de las jugadoras
  handleChange(evento) {
    const arrayIds: String[] = [];
    for (let i = 0; i < evento.target.value.length; i++) {
      arrayIds[i] = evento.target.value[i].id;
    }
    this.form.value.playersId = arrayIds;
  }
}

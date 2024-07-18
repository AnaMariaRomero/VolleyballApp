import { Component, inject, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
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

  categories: Category [];

  ngOnInit() {
    this.getPlayers();
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

  getPlayers(){
    const sub = this.firebaseSvc.getJugadoras().subscribe({
      next: (res: any) => {
        console.log(res);
        sub.unsubscribe();
      }
    });
  }

  // =========== agregar o actualizar jugadora =====
  addUpdatePlayer(){
    this.utilsSvc.presentModal({
      component: AddUpdatePlayerComponent,
      cssClass: 'add-update-modal'
    })
  }
}

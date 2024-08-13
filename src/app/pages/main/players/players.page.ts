import { Component, inject, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Player } from 'src/app/models/player.model';
import { Position } from 'src/app/models/position.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePlayerComponent } from 'src/app/shared/components/add-update-player/add-update-player.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  players: Player[];

  ngOnInit() {
    this.getPlayers();
  }

  getPlayers(){
    const sub = this.firebaseSvc.getPlayers().subscribe({
      next: (res: any) => {
        this.players = res;
        sub.unsubscribe();
      }
    });
  }

  // =========== agregar o actualizar jugadora =====
  async addUpdatePlayer(){
    let succes = await this.utilsSvc.presentModal({
      component: AddUpdatePlayerComponent,
      cssClass: 'add-update-modal'
    })

    if (succes) this.getPlayers();
  }
}

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
  playersToShow: Player[] = [];
  categories: Category[];
  lastCategory: string;
  isShowing: boolean = false;

  ngOnInit() {
    this.getPlayers();
    this.getParams();
  }

  async getParams(){
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

  getPlayers(){
    const sub = this.firebaseSvc.getPlayers().subscribe({
      next: (res: any) => {
        this.players = res;
        sub.unsubscribe();
      }
    });
  }

  buscarJugadorasPorCategoria(category: string){
    if (category != this.lastCategory){
      this.isShowing = true;
      this.playersToShow = [];
      this.lastCategory = category;
      this.players.forEach(player => {
        player.categories.find(obj => {
          if(obj.name === category){
            this.playersToShow.push(player);
          }
        });
      });
    } else{
      this.playersToShow = [];
      this.isShowing = false;
    }
  }

  // =========== agregar o actualizar jugadora =====
  async addUpdatePlayer(){
    let succes = await this.utilsSvc.presentModal({
      component: AddUpdatePlayerComponent,
      cssClass: 'add-update-modal'
    })

    if (succes) this.getPlayers();
  }

  verDetalleJugadora(playerId: string){
    //ir a ver los partidos asociados a ese jugador.
    this.utilsSvc.router.navigate(['main/player'], { queryParams: { id: playerId } });
  }
}

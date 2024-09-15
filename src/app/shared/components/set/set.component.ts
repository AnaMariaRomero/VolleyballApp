import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Player } from 'src/app/models/player.model';
import { SetGame } from 'src/app/models/set-game.model';
import { Statistics } from 'src/app/models/statistics.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
})
export class SetComponent  implements OnInit {

  @Input() numberSet: number;
  @Input() playersSet: string[];
  @Input() matchId: string;
  @Input() setGame: SetGame;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  pointsFavor: number = 0;
  pointsAgainst: number = 0;
  players!: Player[];
  staticsPlayersArray: Statistics[] = [];
  jugadoraSeleccionada: boolean = false;
  selectedPlayer!: Player;

  
  constructor() { }

  ngOnInit() {
    this.getJugadorasPorId(this.playersSet);
    this.createstaticsPlayersArray(this.playersSet);
  }

  createstaticsPlayersArray(playersSetIds: string[]) {
    //creo el array para almacenar los puntos de cada jugadora.
    this.staticsPlayersArray = playersSetIds.map(item => ({
      playerId: item,
      matchId: this.matchId,
      setId: this.setGame.id,
      statisticsPositiveList: [0,0,0,0,0,0],
      statisticsNegativeList: [0,0,0,0,0,0]
    }))
  }

  getSelectedPlayer(player: Player){
    this.jugadoraSeleccionada = true;
    this.selectedPlayer = player;
  }

  agregarPunto(positivo: boolean, tipo: string){
    //Saque, Armado, Ataque, Recepcion, Defensa, Bloqueo
    if (positivo){
      switch(tipo){
        case 'armado':
          this.agregarPuntoPositivoJugadora(1);
          break;
        case 'bloqueo':
          this.agregarPuntoPositivoJugadora(5);
          break;
        case 'ataque':
          this.agregarPuntoPositivoJugadora(2);
           break;
        case 'defensa':
          this.agregarPuntoPositivoJugadora(4);
          break;
        case 'saque':
          this.agregarPuntoPositivoJugadora(0);
          break;
       default:
          this.agregarPuntoPositivoJugadora(3);
          break;
      }
    } else {
      switch(tipo){
        case 'armado':
          this.agregarPuntoNegativoJugadora(1);
          break;
        case 'bloqueo':
          this.agregarPuntoNegativoJugadora(5);
          break;
        case 'ataque':
          this.agregarPuntoNegativoJugadora(2);
           break;
        case 'defensa':
          this.agregarPuntoNegativoJugadora(4);
          break;
        case 'saque':
          this.agregarPuntoNegativoJugadora(0);
          break;
       default:
          this.agregarPuntoNegativoJugadora(3);
          break;
      }
    }    
  }

  agregarPuntoPositivoJugadora(indicePositiveArray: number) {
    let i = 0;
    while(this.staticsPlayersArray[i].playerId != this.selectedPlayer.id){
      i++;
    }
    this.staticsPlayersArray[i].statisticsPositiveList[indicePositiveArray]++;
  }

  agregarPuntoNegativoJugadora(indiceNegativeArray: number) {
    let i = 0;
    while(this.staticsPlayersArray[i].playerId != this.selectedPlayer.id){
      i++;
    }
    this.staticsPlayersArray[i].statisticsNegativeList[indiceNegativeArray]++;
  }

  getJugadorasPorId(playerIds: string[]){
    //busco cada jugadora que tengo en la lista de ids
    this.firebaseSvc.getPlayersById(playerIds).then((resultado) => {
      for (let i = 0; i < resultado.length; i++) {
        resultado[i].id = playerIds[i];
      }
      this.players = resultado;
    });
  }

  increment() {
    this.pointsFavor++;
  }

  discount(){
    this.pointsAgainst++;
  }

  async setFinalSet() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.setGame.setFinish = true;
    this.setGame.pointsAgainst = this.pointsAgainst;
    this.setGame.pointsFavor = this.pointsFavor;
    this.setGame.players = this.players;
    this.firebaseSvc.finishSet(this.setGame, this.staticsPlayersArray)
      .then(() => {
      // Establecer un timeout para recargar la página
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error finalizando el set: ', error);
      loading.dismiss(); // Ocultar el loading también en caso de error
    });
  }
}

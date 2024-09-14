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
  statisticsPlayersArray: Statistics[] = [];
  jugadoraSeleccionada: boolean = false;
  selectedPlayer!: Player;
  isLoading: boolean;

  
  constructor(private loadingController: LoadingController) { }

  ngOnInit() {
    console.log(this.playersSet, this.setGame, this.matchId)
    this.getJugadorasPorId(this.playersSet);
    this.createStaticsticsPlayersArray(this.playersSet);
    console.log("pasa por acá")
  }

  createStaticsticsPlayersArray(playersSetIds: string[]) {
    //creo el array para almacenar los puntos de cada jugadora.
    this.statisticsPlayersArray = playersSetIds.map(item => ({
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
          console.log('sumo armado');
          break;
        case 'bloqueo':
          console.log('sumo bloqueo');
          this.agregarPuntoPositivoJugadora(5);
          break;
        case 'ataque':
          console.log('sumo ataque');
          this.agregarPuntoPositivoJugadora(2);
           break;
        case 'defensa':
          console.log('sumo defensa');
          this.agregarPuntoPositivoJugadora(4);
          break;
        case 'saque':
          console.log('sumo saque');
          this.agregarPuntoPositivoJugadora(0);
          break;
       default:
          console.log('sumo recepcion');
          this.agregarPuntoPositivoJugadora(3);
          break;
      }
    } else {
      switch(tipo){
        case 'armado':
          this.agregarPuntoNegativoJugadora(1);
          console.log('sumo armado');
          break;
        case 'bloqueo':
          console.log('sumo bloqueo');
          this.agregarPuntoNegativoJugadora(5);
          break;
        case 'ataque':
          console.log('sumo ataque');
          this.agregarPuntoNegativoJugadora(2);
           break;
        case 'defensa':
          console.log('sumo defensa');
          this.agregarPuntoNegativoJugadora(4);
          break;
        case 'saque':
          console.log('sumo saque');
          this.agregarPuntoNegativoJugadora(0);
          break;
       default:
          console.log('sumo recepcion');
          this.agregarPuntoNegativoJugadora(3);
          break;
      }
    }    
  }

  agregarPuntoPositivoJugadora(indicePositiveArray: number) {
    let i = 0;
    while(this.statisticsPlayersArray[i].playerId != this.selectedPlayer.id){
      i++;
    }
    this.statisticsPlayersArray[i].statisticsPositiveList[indicePositiveArray]++;
  }

  agregarPuntoNegativoJugadora(indiceNegativeArray: number) {
    let i = 0;
    while(this.statisticsPlayersArray[i].playerId != this.selectedPlayer.id){
      i++;
    }
    this.statisticsPlayersArray[i].statisticsNegativeList[indiceNegativeArray]++;
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
    // Mostrar el loading antes de ejecutar el proceso
    const loading = await this.loadingController.create({
      message: 'Finalizando set...',
      spinner: 'crescent', // O cualquier otro tipo de spinner
    });
    this.isLoading = true;
    this.setGame.setFinish = true;
    this.setGame.pointsAgainst = this.pointsAgainst;
    this.setGame.pointsFavor = this.pointsFavor;
    this.setGame.players = this.players;

    // Esperar a que finishSet termine y luego recargar la página
    await loading.present();

    this.firebaseSvc.finishSet(this.setGame, this.statisticsPlayersArray)
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
    this.isLoading = false;
  }
}

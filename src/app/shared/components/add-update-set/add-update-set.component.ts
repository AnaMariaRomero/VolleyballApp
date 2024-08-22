import { Component, inject, Input, OnInit } from '@angular/core';
import { indexedDBLocalPersistence } from 'firebase/auth';
import { Player } from 'src/app/models/player.model';
import { SetGame } from 'src/app/models/set-game.model';
import { Statistics } from 'src/app/models/statistics.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-set',
  templateUrl: './add-update-set.component.html',
  styleUrls: ['./add-update-set.component.scss'],
})

export class AddUpdateSetComponent  implements OnInit {

  @Input() numberSet: number;
  @Input() playersSet: string[];
  @Input() setId: string;
  @Input() matchId: string;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  setGame: SetGame = {} as SetGame;
  pointsFavor: number = 0;
  pointsAgainst: number = 0;
  players!: Player[];
  statisticsPlayersArray: Statistics[] = [];
  jugadoraSeleccionada: boolean = false;
  selectedPlayer!: Player;
  si: boolean;
  
  constructor() { }

  ngOnInit() {
    this.getJugadorasPorId(this.playersSet);
    this.createStaticsticsPlayersArray(this.playersSet);
  }

  createStaticsticsPlayersArray(playersSetIds: string[]) {
    //creo el array para almacenar los puntos de cada jugadora.
    this.statisticsPlayersArray = playersSetIds.map(item => ({
      playerId: item,
      matchId: this.matchId,
      setId: this.setId,
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

  setFinalSet(){

    this.setGame.setFinish = true;
    this.setGame.pointsAgainst = this.pointsAgainst;
    this.setGame.pointsFavor = this.pointsFavor;
    this.setGame.id = this.setId;
    this.setGame.matchId = this.matchId;
    this.utilsSvc.dismissModal({ success: true });
    this.firebaseSvc.finishSet(this.setGame, this.statisticsPlayersArray);
  }
}
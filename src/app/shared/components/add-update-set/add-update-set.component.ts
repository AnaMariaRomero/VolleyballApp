import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Player } from 'src/app/models/player.model';
import { SetGame } from 'src/app/models/set-game.model';
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

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    points: new FormControl(''),
    finalSet: new FormControl(),
  })

  setGame: SetGame;
  points: number = 0;
  players: Player[];
  
  constructor() { }

  ngOnInit() {
    this.getJugadorasPorId(this.playersSet);
    
  }
  selectedPlayer(player: Player){
    //modifico la estadistica del Player, si tiene en vacío el id de estadística, entonces creo una estadística
    player.staticsPlayer
    //updeteo su estadistica
     Statistics {
      id: string,
      playerId: string,
      setId: string,
      staticsList: string[]
    }

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
    this.points++;
  }

  isFinalSet(){
    //mostrar las estadisticas con el modal
  }

  setFinalSet(){
    this.form.value.finalSet = true;
    this.utilsSvc.dismissModal({ success: true });
  }

}

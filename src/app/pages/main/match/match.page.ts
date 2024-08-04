import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Match } from 'src/app/models/match.model';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateSetComponent } from 'src/app/shared/components/add-update-set/add-update-set.component';


@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})

export class MatchPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    number: new FormControl(),
    matchId: new FormControl(''),
    points: new FormControl(),
  })
  
  match: Match;
  numberSet: number = 0;
  isOpen = false;
  players: Player[];
  selectedPlayers: string[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const partidoId = params['id'];
      this.getPartido(partidoId).then(() => {
        this.getJugadorasPorId(this.match.playersId); // Esto se ejecutará después de que getPartido termina, pq es un promise feo
      });
    }); 
  }

  //lo hicimos promise para que me agarre el this.match luego. Todo esto es porque no es un Observable.
  getPartido(partidoId: string): Promise<void> {
    //otra forma de obtener datos con GetDocument
    return this.firebaseSvc.getMatch(partidoId).then((match: Match) => {
      // guardamos al usuario localmente;
      this.match = match;
    });
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

  addUpdateSet(){
    console.log("marchdas: ", this.match.id)
    let succes = this.utilsSvc.presentModal({
      component: AddUpdateSetComponent,
      cssClass: 'add-update-modal',

      componentProps: {
        numberSet: this.numberSet, // Reemplaza con tu número
        playersSet: this.selectedPlayers, // Reemplaza con tu array
      }
    })

    if (succes) console.log("OK.");
  }

  changeSet(numberSet: number){
    if (!this.isOpen) {
      this.isOpen = true; 
      this.numberSet = numberSet;
    }
    else {
      this.isOpen = false;
    } 
  }

  incrementPoints() {
    this.form.value.points++;
  }

  selectedPlayer(player: string) {
    if (!this.selectedPlayers.includes(player)) {
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers = this.selectedPlayers.filter(p => p !== player);
    }
  }

}

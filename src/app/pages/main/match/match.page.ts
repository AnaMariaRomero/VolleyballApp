import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Match } from 'src/app/models/match.model';
import { Player } from 'src/app/models/player.model';
import { SetGame } from 'src/app/models/set-game.model';
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
  
  match: Match;
  setId: string;
  partidoId: string;
  numberSet: number = 0;
  players: Player[];
  selectedPlayers: string[] = [];
  selectedPlayersToShow: number[] = [];
  setsGames: SetGame[] = [];
  finPartido: boolean = false;
  finSet: boolean;
  isLoading = true;
  setSeleccionado: boolean = false;
  llamarSet: boolean = false;
  setGame: SetGame;

  constructor( private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
        this.partidoId = params['id'];
        await this.getPartido(this.partidoId);
        this.getJugadorasPorId(this.match.playersId);
        this.terminoPartido(this.match);

        // Obtener los sets después de que se haya cargado el partido y se haya determinado el ID
        await this.getSetsGamePorMatchId(this.partidoId);

        if (this.setsGames.length === 0) {
            // Si no hay sets, intentamos crearlos
            await this.firebaseSvc.addArraySetsGameForMatch(this.partidoId);

            // Volver a cargar los sets después de crearlos
            await this.getSetsGamePorMatchId(this.partidoId);
        }

        this.setSeleccionado = false;
        this.isLoading = false;
    });
}
  async getSetsGamePorMatchId(partidoId: string) {
    const resultado = await this.firebaseSvc.getSetsGameByMatchId(partidoId);
    resultado.subscribe((sets: SetGame[]) => {
        this.setsGames = sets;
        console.log("Sets obtenidos: ", this.setsGames);
    });
  }

  //lo hicimos promise para que me agarre el this.match luego. Todo esto es porque no es un Observable.
  getPartido(partidoId: string): Promise<void> {
    //otra forma de obtener datos con GetDocument
    return this.firebaseSvc.getMatch(partidoId).then((match: Match) => {
      // guardamos al usuario localmente;
      console.log("djksadj: ", match)
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

  addSet(){
    this.llamarSet = true;
    this.findSet();
  }

  findSet(){
    const set = this.setsGames.find(obj => obj.number === this.numberSet);
    if (set) {
      this.setGame = set;
    }
  }

  changeSet(numberSet: number){
    if (numberSet != this.numberSet) {
      this.setSeleccionado = true;
      this.numberSet = numberSet;
      const set = this.setsGames.find(obj => obj.number === this.numberSet);
      this.finSet = set.setFinish
    }
  }

  selectedPlayer(player: Player) {
    if (!this.selectedPlayers.includes(player.id)) {
      this.selectedPlayers.push(player.id);
      this.selectedPlayersToShow.push(player.numberPlayer);
    } else {
      this.selectedPlayers = this.selectedPlayers.filter(p => p !== player.id);
      this.selectedPlayersToShow = this.selectedPlayersToShow.filter(p => p !== player.numberPlayer);
    }
  }

  terminarPartido(){
    this.match.matchFinish = true;
    window.location.reload();
  }

  terminoPartido(match: Match){
    this.finPartido =  match.matchFinish;
  }
}

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  partidoId: string;
  numberSet: number = 0;
  isOpen = false;
  players: Player[];
  selectedPlayers: string[] = [];
  setsGames: SetGame[] = [];
  finPartido: boolean = false;
  finSet: boolean;

  constructor(private router: Router, private route: ActivatedRoute) { }

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

  async addUpdateSet(){
    //acá ya creo el set en firebase, le envío el setId
    console.log("acá abajp",this.setsGames);
    //fijarme si me conviene más obtener solo el set o obtener el array de set, ver extensión.
    const set = this.setsGames.find(obj => obj.number === this.numberSet);
    if (set) {
      // Si se encontró el set, abrir el modal
      await this.utilsSvc.presentModal({
          component: AddUpdateSetComponent,
          cssClass: 'add-update-modal',
          componentProps: {
              numberSet: this.numberSet,
              playersSet: this.selectedPlayers, 
              setId: set.id,
              matchId: this.partidoId
          }
      });
    } else {
        console.error('Set no encontrado.');
    }
  }

  changeSet(numberSet: number){
    if (!this.isOpen) {
      this.isOpen = true; 
      this.numberSet = numberSet;
      const set = this.setsGames.find(obj => obj.number === this.numberSet);
      this.finSet = set.setFinish
    }
    else {
      this.isOpen = false;
    } 
  }

  selectedPlayer(player: string) {
    if (!this.selectedPlayers.includes(player)) {
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers = this.selectedPlayers.filter(p => p !== player);
    }
  }

  terminarPartido(){
    this.match.matchFinish = true;
    this.router.navigate(['/match', this.partidoId]);

    console.log("This match entire: ", this.match);
  }

  terminoPartido(match: Match){
    this.finPartido =  match.matchFinish;
  }
}

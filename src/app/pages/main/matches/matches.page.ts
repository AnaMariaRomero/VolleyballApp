import { Component, OnInit, inject } from '@angular/core';
import { Match } from 'src/app/models/match.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateMatchComponent } from 'src/app/shared/components/add-update-match/add-update-match.component';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  matches: Match[];

  ngOnInit() {
    this.getMatches();
  }

  getMatches(){
    const sub = this.firebaseSvc.getMatches().subscribe({
      next: (res: any) => {
        this.matches = res;
        sub.unsubscribe();
      }
    });
  }

  // =========== agregar o actualizar jugadora =====
  async addUpdateMatch(){
    let succes = await this.utilsSvc.presentModal({
      component: AddUpdateMatchComponent,
      cssClass: 'add-update-modal'
    })

    if (succes) this.getMatches();
  }

  goPartido(matchId: string){
    this.utilsSvc.router.navigate(['main/match'], { queryParams: { id: matchId } });
  }

}

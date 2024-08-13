import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersPageRoutingModule } from './players-routing.module';

import { PlayersPage } from './players.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [PlayersPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PlayersPageRoutingModule,
        SharedModule
    ]
})
export class PlayersPageModule {}

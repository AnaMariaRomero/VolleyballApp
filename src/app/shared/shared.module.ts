import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdatePlayerComponent } from './components/add-update-player/add-update-player.component';
import { AddUpdateMatchComponent } from './components/add-update-match/add-update-match.component';
import { AddUpdateSetComponent } from './components/add-update-set/add-update-set.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GraphicsComponent } from './components/graphics/graphics.component';
import { SetComponent } from './components/set/set.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdatePlayerComponent,
    AddUpdateMatchComponent,
    AddUpdateSetComponent,
    GraphicsComponent,
    SetComponent,
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdatePlayerComponent,
    AddUpdateMatchComponent,
    AddUpdateSetComponent,
    GraphicsComponent,
    SetComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule, 
    NgApexchartsModule,
  ]
})
export class SharedModule { }

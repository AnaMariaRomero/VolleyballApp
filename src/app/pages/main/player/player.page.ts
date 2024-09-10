import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Statistics } from 'src/app/models/statistics.model';
import { UtilsService } from 'src/app/services/utils.service';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>[] = [];

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  constructor(private route: ActivatedRoute) {

  }

  isLoading = true;
  isSearching = true;
  playerId: string;
  player: Player;
  statistics: Statistics[];
  statisticsPositiveList: number[];
  statisticsNegativeList: number[];
  verGrafica: boolean[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.playerId = params['id'];
      await this.getPlayerById(this.playerId);
      this.isLoading = false;
      this.isSearching = false;
      this.getStatistics(this.player);
    });
  }

  async getStatistics(player: Player) {
    this.statistics = player.staticsPlayer;  
  }

  async getPlayerById(playerId: string): Promise<void> {
    return this.firebaseSvc.getPlayer(playerId).then((dato: Player) => {
      this.player = dato;   
    });
  }

}

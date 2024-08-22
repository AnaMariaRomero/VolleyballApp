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
  nameMatch: string[] = [];
  numberSet: number[] = [];
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
    if (this.statistics.length > 0) {
      this.statistics.forEach((statistic, index) => {
      this.getMatchSetInformation(statistic.matchId, statistic.setId, index);
    })
    }
    
  }

  async getPlayerById(playerId: string): Promise<void> {
    return this.firebaseSvc.getPlayer(playerId).then((dato: Player) => {
      this.player = dato;   
    });
  }

  //tarea para dentro de unas horas: 
  //cerrar la grafica en que estoy parada 
  //si tengo que abrir la gráfica, minimo debo contar con los datos para verla
  cerrarGrafica(i: number){
      this.verGrafica[i] = false;    
  }

  async getMatchSetInformation(matchId: string, setId: string, i: number) {
    await this.firebaseSvc.getMatchSetInformation(matchId, setId).then((result) => {
      this.nameMatch[i] = result.nombrePartido;
      this.numberSet[i] = result.setPartido;});
  }

  armarGrafica(statistic: Statistics, i: number) {
    this.verGrafica[i] = true;
    this.chartOptions[i] = {
        series: [
            {
                name: "Positivo",
                data: [statistic.statisticsPositiveList[0], statistic.statisticsPositiveList[1],
                statistic.statisticsPositiveList[2], statistic.statisticsPositiveList[3],
                statistic.statisticsPositiveList[4], statistic.statisticsPositiveList[5]]
            },
            {
                name: "Negativo",
                data: [statistic.statisticsNegativeList[0], statistic.statisticsNegativeList[1],
                statistic.statisticsNegativeList[2], statistic.statisticsNegativeList[3],
                statistic.statisticsNegativeList[4], statistic.statisticsNegativeList[5]]
            }
        ],
        chart: {
            height: 350,
            type: "radar"
        },
        title: {
            text: "Gráfica cheta"
        },
        xaxis: {
            categories: ["Saque", "Armado", "Ataque", "Recepcion", "Defensa", "Bloqueo"]
        }
    };
    }
}

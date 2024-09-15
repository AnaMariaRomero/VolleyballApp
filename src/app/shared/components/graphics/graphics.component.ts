import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { Statistics } from 'src/app/models/statistics.model';
import { ChartOptions } from 'src/app/pages/main/player/player.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss'],
})
export class GraphicsComponent  implements OnInit {

  @Input() statistics!: Statistics;
  
  constructor() { }

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  
  nameMatch: string;
  numberSet: number;
  statisticsPositiveList: number;
  statisticsNegativeList: number;
  verGrafica: boolean = false;

  ngOnInit() {
    this.getMatchSetInformation(this.statistics.matchId, this.statistics.setId).then((result) => {
      this.nameMatch = result.nombrePartido;
      this.numberSet = result.setPartido;});
  }

  async getMatchSetInformation(matchId: string, setId: string) {
    return await this.firebaseSvc.getMatchSetInformation(matchId, setId);
  }

  armarGrafica(statistic: Statistics) {
    this.verGrafica = true;
    this.chartOptions = {
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
            text: "Gráfica"
        },
        xaxis: {
            categories: ["Saque", "Armado", "Ataque", "Recepcion", "Defensa", "Bloqueo"]
        }
    };
  }

  tienePuntosParaMostrar(positivo: number[], negativo: number[] ): boolean {
    let total = 0;
    positivo.forEach(element => {
      total = element + total;
      });
    negativo.forEach(element => {
      total = element + total;
      });
    return total != 0;
  }

  cerrarGrafica(){
    this.verGrafica = false;    
}

}

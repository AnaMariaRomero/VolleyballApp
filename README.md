# VolleyAppResponsivo

# Indice

*   Presentación
*   Instalación
    *   Node.js
    *   Ionic
    *   Firebase

Aplicación que ayuda a cargar los datos sobre jugadoras de voley en tiempo real. Permitiendo sacar estadísticas de cada jugadora en las distintas posiciones. 

# Tecnologías utilizadas
La aplicación se realizará con las tecnologías: IONIC - ANGULAR - FIREBASE - NODE.JS - WINDOWS 11 - VSC (extensiones: Ionic - Ionic Snippets - Ionic Preview - Prettier - Angular 17 Snippets - Angular schematics)

## Instalación

### Node.js

Primero vamos a instalar Node.js, para ello nos dirijimos a la [página oficial](https://nodejs.org/en) y nos descargamos la versión estable.
Luego de la instalación, por terminal deberíamos de verificar si se encuentra bien instalado: 
> npm --version 

### Ionic 
Como segundo paso, vamos a instalar Ionic. Para ello vamos a ir a la terminar y correr el siguiente comando:
> npm install -g @ionic/cli

### Firebase
Necesitamos almacenar nuestros datos, para ello utilizamos Firebase. Con el comando: 
> npm i firebase @angular/fire

Una vez que descarga todo, vamos a la página oficial e [ingresamos a la Firebase console.](https://console.firebase.google.com/u/0/).
Vamos a crear un nuevo proyecto:
- Ingresamos el nombre **volley-app**
- Deshabilitamos por ahora en Google Analytics.
- Luego, inicializamos una app web. Le colocamos el nombre **Voley Estadísticas** y la registramos (no configuramos el Firebase Hosting).
Ahora tenemos que agregar el sdk a nuestro proyecto, nos dan lo siquiente:

```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADBg3XWroRtbtpCn1X1fIHY93EVMoVehk",
  authDomain: "volley-app-a77be.firebaseapp.com",
  projectId: "volley-app-a77be",
  storageBucket: "volley-app-a77be.appspot.com",
  messagingSenderId: "181134803687",
  appId: "1:181134803687:web:bf28e2d91399120aa39842",
  measurementId: "G-X2L2SXG4TC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

```
Lo que nosotros tomamos es lo siguiente: 
```
firebaseConfig = {
  apiKey: "AIzaSyADBg3XWroRtbtpCn1X1fIHY93EVMoVehk",
  authDomain: "volley-app-a77be.firebaseapp.com",
  projectId: "volley-app-a77be",
  storageBucket: "volley-app-a77be.appspot.com",
  messagingSenderId: "181134803687",
  appId: "1:181134803687:web:bf28e2d91399120aa39842",
  measurementId: "G-X2L2SXG4TC"
}
```
Y a esto lo colocamos en el siguente archivo: volley-app/src/environments/environment.ts y volley-app/src/environments/environment.prod.ts, debajo de 
```
production: false/true,
```

Luego vamos a cambiar el archivo tsconfig.json, donde dice "strinct": true -> le colocamos false.

Luego vamos a app-module.ts para agregar las configuraciones de Firebase.

Dentro de la Voley Estadísticas para configurar la Autenticación. Habilitamos el ingreso por mail y contraseña.


## Levantar el entorno

Para ver los cambios realizados en tiempo real, podemos correr el comando: 
> ionic serve

## Integrar gráficos en la app

https://apexcharts.com/docs/update-charts-from-json-api-ajax/

```
import { Component, ViewChild } from "@angular/core";

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
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Estadística de la jugadora",
          data: [80, 50, 30, 40, 100]
        }
      ],
      chart: {
        height: 350,
        type: "radar"
      },
      title: {
        text: "Basic Radar Chart"
      },
      xaxis: {
        categories: ["Saque", "Recepcion", "Defensa", "Bloqueo", "Armado"]
      },
      dataLabels: {
            enabled: true,
            background: {
                enabled: true,
                borderRadius:2,
            }
        },
    };
  }
}

```

La idea es que con el código anterior y con la integración de los datos obtenidos de Firebase, obtener el siguiente gráfico radar.

![Gráfico Radar](volley-app/src/assets/idea-de-grafico/idea-grafico.png)




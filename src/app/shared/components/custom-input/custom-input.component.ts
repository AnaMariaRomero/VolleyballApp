import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  // el ! significa que la variable va a estar sin inicializar
  //Este componente va a estar recibiendo datos: el form
  @Input() control!: FormControl;
  // ¿Cuál es el tipo de input que vamos a utilizar?
  @Input() type!: string;
  // Identificar sobre que estamos escribiendo
  @Input() label!: string;
  //algunos parametros pueden autocompletarse
  @Input() autocomplete!: string;
  // pasarle un icono
  @Input() icon!: string;

  //para ver el ojito de la contraseña
  isPassword!: boolean;
  hide: boolean = true;
  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }

  //para saber si mostrar o no la contraseña
  showOrHidePassword() {
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }

}

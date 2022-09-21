import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import decode from 'jwt-decode';


@Component({
  selector: 'app-response-approved',
  templateUrl: './response-approved.component.html',
  styleUrls: ['./response-approved.component.scss']
})
export class ResponseApprovedComponent implements OnInit {

 
  infoTokenAprovedLine:any;
  message:string ="";
  parametros:any;


  constructor(private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {


    console.log(this.rutaActiva.snapshot.params);
     // Obtener id de la solped seleccionada
     this.parametros = this.rutaActiva.snapshot.params;
     console.log((this.parametros));
     this.infoTokenAprovedLine = decode(this.parametros.crypt);
     this.message = this.parametros.message;
     console.log(this.message,this.infoTokenAprovedLine);
  }

}

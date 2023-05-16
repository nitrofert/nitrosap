import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-consulta-entrada',
  providers:[MessageService],
  templateUrl: './consulta-entrada.component.html',
  styleUrls: ['./consulta-entrada.component.scss']
})
export class ConsultaEntradaComponent implements OnInit {

  entradaSeleccionada:any;

  constructor(private router:Router,
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute,
    public authService: AuthService,
    private comprasService:ComprasService) {

}

  ngOnInit(): void {

    this.entradaSeleccionada = this.rutaActiva.snapshot.params;
    
  }

}

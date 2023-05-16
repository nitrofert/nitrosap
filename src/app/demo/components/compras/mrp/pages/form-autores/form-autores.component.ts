import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-form-autores',
  providers: [MessageService, ConfirmationService],
  templateUrl: './form-autores.component.html',
  styleUrls: ['./form-autores.component.scss']
})
export class FormAutoresComponent implements OnInit{

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  
  infoUsuario!:InfoUsuario;
  urlBreadCrumb:string = "";
  
  displayModal:boolean = false;
  loadingCargue:boolean = false;



  constructor(public authService: AuthService,
    private sapService:SAPService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute,
    private comprasService: ComprasService,) {}


  async ngOnInit(): Promise<void> {

    this.infoUsuario = this.authService.getInfoUsuario();
     
    //////console.logthis.authService.getPerfilesUsuario());
    this.perfilesUsuario = this.authService.getPerfilesUsuario();

    //////console.logthis.router.url);
    //////console.logthis.authService.getPermisosUsuario());
    this.permisosUsuario = this.authService.getPermisosUsuario();
    //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);

    this.urlBreadCrumb = this.router.url;

   
  }

}

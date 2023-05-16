import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-reportes',
  providers: [MessageService, ConfirmationService],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  urlBreadCrumb:string ="";
  url:string ="";

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  reportes:any[] = [];

  constructor(private rutaActiva: ActivatedRoute,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService,
    private sapService:SAPService) { }


  ngOnInit(): void {

    //Cargar informacion del usuario
    this.getInfoUsuario();
    //Cargar perfiles del usuario
    this.getPerfilesUsuario();
    //Cargar permisos del usuario
    this.getPermisosUsuario();
    //Cargar permisos usuario pagina
    this.getPermisosUsuarioPagina();
    //Cargar reportes de compras segun permisos del usuario
    this.getMenuReportes();

    
  }

  getInfoUsuario(){
    this.infoUsuario = this.authService.getInfoUsuario();
  }

  getPerfilesUsuario(){
    this.perfilesUsuario = this.authService.getPerfilesUsuario();
  }

  getPermisosUsuario(){
    this.permisosUsuario = this.authService.getPermisosUsuario();
  }

  getPermisosUsuarioPagina(){
    //let url ="";
    //console.log("URL origen",this.router.url);
    //console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['entrada']){
      let entradaSeleccionada = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
        this.url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
      }
      console.log("URL con parametros: ",this.url);
    }else{
      this.url= this.router.url;
      console.log("URL sin parametros: ",this.url);
    }
    this.urlBreadCrumb = this.url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.url);
    //console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getMenuReportes(){
    let menu = this.authService.getMenuUsuario();
    console.log(menu.opcionesSubMenu.filter((item: {url: string; visible: number; }) => item.visible === 0 && item.url.includes(this.url)));
    this.reportes = menu.opcionesSubMenu.filter((item: {url: string; visible: number; }) => item.visible === 0 && item.url.includes(this.url));
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-cuentas',
  providers: [MessageService, ConfirmationService],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss'],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class CuentasComponent implements OnInit {

  urlBreadCrumb:string ="";
  infoUsuario!:InfoUsuario;
  perfilesUsuario!:PerfilesUsuario[];
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];

  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private sapService:SAPService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService) { }

  ngOnInit(){

     //obtener datos del usuario logueado
     this.infoUsuario = this.authService.getInfoUsuario();
     
     //////console.logthis.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     //////console.logthis.router.url);
     //////console.logthis.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     //this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
     

     this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
     //console.log(this.permisosUsuarioPagina);
     //console.log(await this.authService.permisosPagina(this.permisosPerfilesPagina));
     this.urlBreadCrumb = this.router.url;

  }

}

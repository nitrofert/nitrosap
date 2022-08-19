import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { LayoutService } from '../../service/app.layout.service';



@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    logo:string = "";
    companyname:string ="";

    items!: MenuItem[];
    itemsPerfil!: MenuItem[];

    constructor(public layoutService: LayoutService,
                private router:Router) {
        //obtener datos del usuario logueado
        let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
        const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
        const token = localStorage.getItem('token') || '';
        this.logo= infoSession[0].logoempresa;
        this.companyname = infoSession[0].companyname;
     }

     

     ngOnInit() {
         this.itemsPerfil = [
             {label: 'Perfil', 
              icon: 'pi pi-fw pi-id-card',
              command: () => {
                  console.log("Mostrar info del usuario logueado");
              }
            },
             {label: 'Salir', 
              icon: 'pi pi-fw pi-power-off',
              command: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('infoSession');
                this.router.navigate(['/']);
              }
            }
         ];
     }

     salir(){
        localStorage.removeItem('token');
        localStorage.removeItem('infoSession');
        this.router.navigate(['/']);
     }
}

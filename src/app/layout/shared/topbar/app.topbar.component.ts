import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from '../../service/app.layout.service';



@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    logo:string = "";
    companyname:string ="";
    fullnameUser:string=";"

    items!: MenuItem[];
    itemsPerfil!: MenuItem[];

    constructor(public layoutService: LayoutService,
                private router:Router,
                private authService:AuthService) {
        //obtener datos del usuario logueado
       
        
        /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
        const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
        const token = localStorage.getItem('token') || '';*/

        const token = this.authService.getToken();
        const infoSession = this.authService.getInfoToken(token);
        
        this.logo= infoSession.infoUsuario.logoempresa;
        this.companyname = infoSession.infoUsuario.companyname;
        this.fullnameUser = infoSession.infoUsuario.fullname;

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

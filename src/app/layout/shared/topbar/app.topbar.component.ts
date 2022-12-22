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

        //const token = this.authService.getToken();
        //const infoSession = this.authService.getInfoToken(token);

        const infoSession = this.authService.getInfoUsuario();
        //console.log(infoSession);
        
        this.logo= infoSession.logoempresa;
        this.companyname = infoSession.companyname;
        this.fullnameUser = infoSession.fullname;

     }

     

     ngOnInit() {
         this.itemsPerfil = [
             {label: 'Perfil', 
              icon: 'pi pi-fw pi-id-card',
              command: () => {
                  //console.log("Mostrar info del usuario logueado");
              }
            },
             {label: 'Salir', 
              icon: 'pi pi-fw pi-power-off',
              command: () => {
                this.salir();
              }
            }
         ];
     }

     salir(){
        this.authService.logOut(this.authService.getToken())
            .subscribe({
              next: (result) => {
                console.log(result);
              },
              error: (err) => {
                console.log(err);
              }
            });
        localStorage.removeItem('tokenid');
        localStorage.removeItem('infoUsuario');
        localStorage.removeItem('perfilesUsuario');
        localStorage.removeItem('menuUsuario');
        localStorage.removeItem('permisosUsuario');
        this.router.navigate(['/']);
     }

     print(){
      window.print();
     }

     verPerfil(){
      this.router.navigate(['/portal/perfil']);
     }
}

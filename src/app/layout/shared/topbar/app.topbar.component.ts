import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { LayoutService } from '../../service/app.layout.service';



@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    logo:string = "";
    companyname:string ="";

    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {
        //obtener datos del usuario logueado
        let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
        const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
        const token = localStorage.getItem('token') || '';
        this.logo= infoSession[0].logoempresa;
        this.companyname = infoSession[0].companyname;
     }
}

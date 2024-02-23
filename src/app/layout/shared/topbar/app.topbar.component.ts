import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from '../../service/app.layout.service';
import { AdminService } from 'src/app/demo/service/admin.service';



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

    itemsNoticias:MenuItem[] = [];

    classNoticias:string = "";
    vernoticia:boolean = false;

    infoNoticia!:any;

    @ViewChild('menu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,
                private router:Router,
                public authService:AuthService,
                private adminService:AdminService,) {
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

     

     async ngOnInit() {
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
         await this.getNoticias();
         
     }

     async getNoticias():Promise<void>{

          this.adminService.getNoticiasActivas(this.authService.getToken())
              .subscribe({
                  next: (noticias) => {
                    console.log(noticias);
                    if(noticias.length > 0){
                      this.classNoticias = 'text-red-600';
                      this.setMenuNoticias(noticias);
                    }else{
                      this.classNoticias= '';
                    }
                  },
                  error:(err)=> {
                    console.error(err);
                  },
              });

     }

     setMenuNoticias(noticias:any[]){
        /*this.itemsNoticias = noticias.map((noticia=>{
          return { 
                    label:noticia.titulo,
                    icon:'',
                    command: ()=> {
                      this.verNoticia(noticia);
                    }
                 }
        }))*/

        for(let noticia of noticias){
          this.itemsNoticias.push({
            label:noticia.titulo,
            icon:'pi pi-bolt',
            iconClass: 'text-xl text-yellow-400',
            //iconStyle:'color:var(--yellow-400)',
            //iconClass:'bg-yellow-40',

            command:()=> {
              this.verNoticia(noticia);
            },
          })
        }
     }

     verNoticia(noticia:any){
      console.log(noticia);
      this.vernoticia = true;
      this.infoNoticia = noticia;
     }

     none(){
       
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

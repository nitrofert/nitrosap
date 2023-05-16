import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { MenuInterface } from 'src/app/demo/api/menu.interface';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-editar-menu',
  providers: [MessageService],
  templateUrl: './editar-menu.component.html',
  styleUrls: ['./editar-menu.component.scss']
})
export class EditarMenuComponent implements OnInit {
  menuSelected:any ;

  title:string = "";
  description:string = "";
  ordernum:string ="";
  hierarchy:string="";
  padre!:number | null;
  url:string = "";
  icon:string = "";

  submitted: boolean = false;

  padres:MenuInterface[] = [];

  messageForm:Message[]=[];
  submitBotton = false;

  hierarchies = [
        { name: 'Padre', code: 'P' },
        { name: 'Hijo', code: 'H' }
       
    ];

  /*infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";*/

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              public authService:AuthService) { }

  ngOnInit(): void {
    
    this.menuSelected = this.rutaActiva.snapshot.params;
    //console.log((this.menuSelected.menu));

    /*this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/

    this.adminService.getMuenuById(this.authService.getToken(),this.menuSelected.menu)
    .subscribe({
      next:(menu =>{
          
          //console.log(menu);
          this.title = menu[0].title;
          this.description = menu[0].description;
          this.hierarchy = menu[0].hierarchy;
         
         
          this.url = menu[0].url || '';
          this.icon = menu[0].icon || '';

          if(this.hierarchy=='H'){
            this.loadPadres();
            this.padre = menu[0].iddad;
          }

          this.ordernum = menu[0].ordernum;

          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.log(err);
      })
    });

  }

  saveMenu(){
    this.submitted=true;
    if(!this.title || !this.hierarchy || (this.hierarchy=='H' && !this.padre)){
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else{
      this.submitBotton = true;
      //obtener datos del usuario logueado
      //let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
      //const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
      //const token = localStorage.getItem('token') || '';
      //Registrar menu
      const newMenu:MenuInterface = {
        id:this.menuSelected.menu,
        title:this.title,
        description:this.description,
        ordernum:this.ordernum,
        hierarchy:this.hierarchy,
        iddad:this.padre,
        url:this.url,
        icon:this.icon

      }

      //console.log(newMenu);
      
      this.adminService.updateMenuOpcion(this.authService.getToken(),newMenu)
      .subscribe({
        next:(menu =>{
            
           //console.log(menu);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado la opción del menú ${this.title}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.error(err);
        })
      });
      
    }

  }

  loadPadres(){
    this.ordernum = "";
    //console.log(this.hierarchy);
    if(this.hierarchy=='H'){
       //obtener datos del usuario logueado
      //let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
      //const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
      //const token = localStorage.getItem('token') || '';
      this.adminService.loadMenuFather(this.authService.getToken())
          .subscribe({
            next:(menu =>{
              
                //console.log(menu);
                this.padres = menu;
            }),
            error:(err =>{
              console.error(err);
            })
          });
    }else{
      this.padres = [];
      
      this.loadOrederNum();
    }
   
  }

  loadOrederNum(){
      //console.log(this.hierarchy, this.padre);

       //obtener datos del usuario logueado
       /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
       const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
       const token = localStorage.getItem('token') || '';*/

      this.adminService.orderNum(this.authService.getToken(),this.hierarchy,this.padre)
      .subscribe({
        next:(menu =>{
          
            //console.log(menu[0].ordernum);
            this.ordernum = menu[0].ordernum;
        }),
        error:(err =>{
          console.error(err);
        })
      });
  }

  clear(){
    this.title ="";
    this.description="";
    this.hierarchy = "";
    this.padre =0;
    this.url ="";
    this.icon  ="";

    this.submitBotton = false;
  }

}

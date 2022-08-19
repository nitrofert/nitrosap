import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { MenuInterface } from 'src/app/demo/api/menu.interface';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';

@Component({
  selector: 'app-nuevo-menu',
  providers: [MessageService],
  templateUrl: './nuevo-menu.component.html',
  styleUrls: ['./nuevo-menu.component.scss']
  
})
export class NuevoMenuComponent implements OnInit {

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
  constructor(private messageService: MessageService,
              private adminService:AdminService) { }

  ngOnInit(): void {
  }

  saveMenu(){
    this.submitted=true;
    if(!this.title || !this.hierarchy || (this.hierarchy=='H' && !this.padre)){
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else{
      this.submitBotton = true;
      //obtener datos del usuario logueado
      let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
      const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
      const token = localStorage.getItem('token') || '';
      //Registrar menu
      const newMenu:MenuInterface = {
        title:this.title,
        description:this.description,
        ordernum:this.ordernum,
        hierarchy:this.hierarchy,
        iddad:this.padre,
        url:this.url,
        icon:this.icon

      }
      
      this.adminService.saveMenuOpcion(token,newMenu)
      .subscribe({
        next:(menu =>{
            
            console.log(menu);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.log(err);
        })
      });
      
    }
    

    //this.submitted=false;
  }

  loadPadres(){
    this.ordernum = "";
    console.log(this.hierarchy);
    if(this.hierarchy=='H'){
       //obtener datos del usuario logueado
      let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
      const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);

          const token = localStorage.getItem('token') || '';
      this.adminService.loadMenuFather(token)
          .subscribe({
            next:(menu =>{
              
                console.log(menu);
                this.padres = menu;
            }),
            error:(err =>{
              console.log(err);
            })
          });
    }else{
      this.padres = [];
      
      this.loadOrederNum();
    }
   
  }

  loadOrederNum(){
      console.log(this.hierarchy, this.padre);

       //obtener datos del usuario logueado
       let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
       const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
       const token = localStorage.getItem('token') || '';

      this.adminService.orderNum(token,this.hierarchy,this.padre)
      .subscribe({
        next:(menu =>{
          
            console.log(menu[0].ordernum);
            this.ordernum = menu[0].ordernum;
        }),
        error:(err =>{
          console.log(err);
        })
      });
  }

  clear(){
    this.submitted = false;
    this.title ="";
    this.description="";
    this.hierarchy = "";
    this.padre =0;
    this.url ="";
    this.icon  ="";
    this.ordernum="";

    this.submitBotton = false;
  }
}

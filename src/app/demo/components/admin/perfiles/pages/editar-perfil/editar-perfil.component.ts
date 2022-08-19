import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { PerfilInterface } from 'src/app/demo/api/perfil';

@Component({
  selector: 'app-editar-perfil',
  providers: [MessageService],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {

  perfilSelected:any ;

  perfil:string = "";
  description:string = "";
  estado:string ="";
  

  submitted: boolean = false;



  messageForm:Message[]=[];
  submitBotton = false;

  estados = [
        { name: 'Activo', code: 'A' },
        { name: 'Inactivo', code: 'I' }
       
    ];

  infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService) { }

  ngOnInit(): void {
    
    this.perfilSelected = this.rutaActiva.snapshot.params;
    console.log((this.perfilSelected.perfil));

    this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';

    this.adminService.getPerfilById(this.token,this.perfilSelected.perfil)
    .subscribe({
      next:(perfil =>{
          
          console.log(perfil);
          this.perfil = perfil[0].perfil;
          this.description = perfil[0].description ||'';
          this.estado = perfil[0].estado || '';
         
        

          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.log(err);
      })
    });

  }

  savePerfil(){
    this.submitted=true;
    if(!this.perfil || !this.estado){
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else{
      this.submitBotton = true;
    
      //Registrar menu
      const newPerfil:PerfilInterface = {
        id:this.perfilSelected.perfil,
        perfil:this.perfil,
        description:this.description,
        estado:this.estado

      }
      
      this.adminService.updatePerfil(this.token,newPerfil)
      .subscribe({
        next:(perfil =>{
            
            console.log(perfil);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado el perfil ${this.perfil}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.log(err);
        })
      });
      
    }

  }



  clear(){
    this.submitBotton = false;
    this.perfil ="";
    this.description="";
    this.estado = "";
  }

}

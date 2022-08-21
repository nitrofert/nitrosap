import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';



@Component({
  selector: 'app-editar-usuario',
  providers: [MessageService],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  userSelected:any ;

  fullname:  string="";
  email:       string="";
  username:   string="";
  codusersap:  string="";
  password:     string="";
  password2:string = "";
  status: string="";
  

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
    
    this.userSelected = this.rutaActiva.snapshot.params;
    console.log((this.userSelected.user));

    this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';

    this.adminService.getUserById(this.token,this.userSelected.user)
    .subscribe({
      next:(user =>{
          
          console.log(user);
          this.fullname = user[0].fullname;
          this.email = user[0].email;
          this.codusersap = user[0].codusersap;
          this.status = user[0].status;
          this.username = user[0].username;
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.log(err);
      })
    }); 

  }

  saveUser(){
    this.submitted=true;
    if (!this.fullname || !this.email ||  !this.username || !this.codusersap  || !this.status) {
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else if(this.password != this.password2){
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Las contraseñas no conciden', life: 3000 }];
    }else{
      this.submitBotton = true;
    
      //Registrar menu
      const newUser:UserInterface = {
        id:this.userSelected.user,
        fullname:this.fullname,
        email:this.email,
        username:this.username,
        status:this.status,
        codusersap:this.codusersap
      }
      
      this.adminService.updateUser(this.token,newUser)
      .subscribe({
        next:(user =>{
            
            console.log(user);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado el usuario ${this.fullname}` , life: 3000}];
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
    this.fullname="";
    this.status="";
    this.email="";
    this.username="";
    this.codusersap="";
    this.password="";
    this.password2="";
  }

}

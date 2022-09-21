import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-perfiles-usuario',
  providers: [MessageService],
  templateUrl: './perfiles-usuario.component.html',
  styleUrls: ['./perfiles-usuario.component.scss']
})
export class PerfilesUsuarioComponent implements OnInit {

  userSelected:any ;
  fullnameUserSelected:string ="";
  perfiles:any[] = [];
  submitted: boolean = false;
  messageForm:Message[]=[];
  submitBotton = false;

  estado:number = 0;
  estados:any[] = [];

  /*infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";*/

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              private authService:AuthService) { }

  ngOnInit(): void {

    this.estados = [{label: 'No', value: 0}, {label: 'Si', value: 1}];
    
    this.userSelected = this.rutaActiva.snapshot.params;
    console.log((this.userSelected.user));

    /*this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/
    
    this.adminService.getUserById(this.authService.getToken() ,this.userSelected.user)
        .subscribe({
          next: (user) => {
            console.log(user);
            this.fullnameUserSelected = user[0].fullname;
          },
          error: (error) => {
            console.log(error);
          }
        })

    this.adminService.getPerfilesUser(this.authService.getToken(),this.userSelected.user)
    .subscribe({
      next:(perfilesUser =>{
          
          console.log(perfilesUser);
          this.perfiles = perfilesUser;
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:( err =>{
        this.submitBotton = false;
        console.log(err);
      })
    }); 

  }

  setPerfilUser(valor:number,idPerfil:number){
    console.log(valor,idPerfil);
    let perfilUser = {
      id_perfil:idPerfil,
      id_user:this.userSelected.user,
      valor
    }
    this.adminService.setPerfilUser(this.authService.getToken(),perfilUser)
        .subscribe({
          next: (acces) => {
            console.log(acces);
          },
          error: (err) => {
            console.log(err);
          }
        });
  }
  
}

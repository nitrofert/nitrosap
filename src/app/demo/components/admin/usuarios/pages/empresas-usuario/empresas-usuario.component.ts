import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';

@Component({
  selector: 'app-empresas-usuario',
  providers: [MessageService],
  templateUrl: './empresas-usuario.component.html',
  styleUrls: ['./empresas-usuario.component.scss']
})
export class EmpresasUsuarioComponent implements OnInit {

  userSelected:any ;
  fullnameUserSelected:string ="";
  companies:any[] = [];
  submitted: boolean = false;
  messageForm:Message[]=[];
  submitBotton = false;

  estado:number = 0;
  estados:any[] = [];

  infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService) { }

  ngOnInit(): void {

    this.estados = [{label: 'No', value: 0}, {label: 'Si', value: 1}];
    
    this.userSelected = this.rutaActiva.snapshot.params;
    console.log((this.userSelected.user));

    this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';
    
    this.adminService.getUserById(this.token,this.userSelected.user)
        .subscribe({
          next: (user) => {
            console.log(user);
            this.fullnameUserSelected = user[0].fullname;
          },
          error: (error) => {
            console.log(error);
          }
        })

    this.adminService.getCompaniesUser(this.token,this.userSelected.user)
    .subscribe({
      next:(companiesUser =>{
          
          console.log(companiesUser);
          this.companies = companiesUser;
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:( err =>{
        this.submitBotton = false;
        console.log(err);
      })
    }); 

  }

  setAccess(valor:number,idCompany:number){
    console.log(valor,idCompany);
    let accessCompany = {
      id_company:idCompany,
      id_user:this.userSelected.user,
      valor
    }
    this.adminService.setAccess(this.token,accessCompany)
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

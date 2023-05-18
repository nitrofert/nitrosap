import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';
import { AuthService } from 'src/app/demo/service/auth.service';


import {MenuItem} from 'primeng/api';
import { Table } from 'primeng/table';


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
  perfiles:any[] = [];
  companies:any[] = [];

  submitted: boolean = false;

  items!: MenuItem[];

  messageForm:Message[]=[];
  submitBotton = false;

  estados = [
        { name: 'Activo', code: 'A' },
        { name: 'Inactivo', code: 'I' }
       
    ];

    opciones:any[] = [];

  
    areas_user:any[] = [];
    loading:boolean = false;
    selectedAreasUser!:any;

    @ViewChild('filter') filter!: ElementRef;

  /*infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";*/

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              public authService:AuthService) { }

  ngOnInit(): void {

    this.opciones = [{label: 'No', value: 0}, {label: 'Si', value: 1}];

    this.items = [
      {label: 'Información usuario', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Perfiles', icon: 'pi pi-fw pi-id-card'},
      {label: 'Empresas', icon: 'pi pi-fw pi-building'},
     
  ];
    
    this.userSelected = this.rutaActiva.snapshot.params;
    //console.log((this.userSelected.user));

    /*this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/

    this.adminService.getUserById(this.authService.getToken(),this.userSelected.user)
    .subscribe({
      next:(user =>{
          
          //console.log(user);
          this.fullname = user[0].fullname;
          this.email = user[0].email;
          this.codusersap = user[0].codusersap;
          this.status = user[0].status;
          this.username = user[0].username;
          this.areas_user = user[0].areas || [];
          this.getPerfiles();
          this.getCompanies();
          
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.error(err);
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
      
      if(this.password !== ''){
        //console.log(this.password);
        newUser.password = this.password;
      }
      
      this.adminService.updateUser(this.authService.getToken(),newUser)
      .subscribe({
        next:(user =>{
            
            //console.log(user);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado el usuario ${this.fullname}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.error(err);
        })
      });
      
    }

  }

  getPerfiles(){
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

  setPerfilUser(valor:any,idPerfil:number){
    console.log(valor,idPerfil);
    let perfilUser = {
      id_perfil:idPerfil,
      id_user:this.userSelected.user,
      valor
    }

    console.log(perfilUser);
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

  getCompanies(){
    this.adminService.getCompaniesUser(this.authService.getToken(),this.userSelected.user)
    .subscribe({
      next:(companiesUser =>{
          
          //console.log(companiesUser);
          this.companies = companiesUser;
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:( err =>{
        this.submitBotton = false;
        console.error(err);
      })
    }); 
  }


  setAccess(valor:number,idCompany:number){
    //console.log(valor,idCompany);
    let accessCompany = {
      id_company:idCompany,
      id_user:this.userSelected.user,
      valor
    }
    console.log(accessCompany);
    this.adminService.setAccess(this.authService.getToken(),accessCompany)
        .subscribe({
          next: (acces) => {
            //console.log(acces);
          },
          error: (err) => {
            console.error(err);
          }
        });
  }

  newArea(){

  }

  deleteArea(){

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

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  cleart(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Message} from 'primeng/api';
import { LoginFormInterface } from 'src/app/demo/api/frmlogin';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CompanyInterface } from '../interfaces/company.interface';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        :host ::ng-deep .p-dropdown {
            width: 100%;
        }
    `]
})
export class LoginComponent  {

    //valCheck: string[] = ['remember'];

    username:string ="";
    password: string = "";
    selectedCompany!: number;
    companies:CompanyInterface[]=[];

    errorForm:boolean=false;
    messageForm:Message[]=[];
    classErrorUser:string="";
    classErrorPassword:string="";
    classErrorCompany:string="";
    classMessageForm:string="";

    

    constructor(
            public layoutService: LayoutService,
            private authService:AuthService, 
            private router: Router
            ) 
            {
                //importar al servicio de consulta de empresas
                this.authService.companies()
                .subscribe({
                next:(companies)=>{
                    console.log(companies);
                    this.companies = companies;
                },
                error:(err)=>{
                    console.log(err);
                }
                });
            }
  
            

    onsubmit(){
        
        this.errorForm= false;
        this.messageForm=[];
        this.classMessageForm="";
        console.log(this.username, this.password, this.selectedCompany);
        console.log(this.companies.find(company => company.id==this.selectedCompany));
        
        if(typeof this.selectedCompany === "undefined"){
            this.classErrorCompany ='ng-invalid ng-dirty';
            this.errorForm = true;
        }
        if(this.username.length==0){
            this.classErrorUser='ng-invalid ng-dirty';
            this.errorForm = true;
        }
        if(this.password.length==0){
            this.classErrorPassword='ng-invalid ng-dirty';
            this.errorForm = true;
        }

        if(!this.errorForm){
            const loginForm:LoginFormInterface ={
              company:this.selectedCompany,
              username:this.username,
              password:this.password
            }
            
            this.authService.login(loginForm)
                .subscribe({
                  next:(response)=>{
                    console.log('Response',response);
                    //Obtener mensaje
                    this.messageForm = [{severity:'success', summary:'', detail:response.message}];
                    //Obtener token y guardarlo en local storage
                    localStorage.setItem('token',response.token!);
                    localStorage.setItem('infoSession',JSON.stringify(response.infoUsuario)); 
                    //redireccionar al main del portal
                    setTimeout(() => {  
                      console.log("Redireccionar al portal"); 
                      this.router.navigate(['portal']);
                    }, 5000);
                  },
                  error:(err)=>{
                    console.log('Error',err.error.message);
                    this.classMessageForm = ' text-red-800';
    
                    this.messageForm = [{severity:'error', summary:'Error:', detail:err.error.message}];
                  }
                });
        }else{
          this.messageForm = [{severity:'error', summary:'Error:', detail:'Los campos en rojo son obligatorios'}];
        }
        
    }

    restoreClass(idControl:any):void{
        console.log(idControl, this.username.length, this.password.length);
        this.messageForm =[];
        if(idControl=='password' && this.password.length!=0) this.classErrorPassword='';
        if(idControl=='username' && this.username.length!=0) this.classErrorUser='';
        if(idControl=='company' && typeof this.selectedCompany !== "undefined") this.classErrorCompany =''
      }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Message, MessageService} from 'primeng/api';
import { LoginFormInterface } from 'src/app/demo/api/frmlogin';
import { AuthService } from 'src/app/demo/service/auth.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CompanyInterface } from '../../../api/company';



@Component({
    selector: 'app-login',
    providers: [MessageService],
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
    submitted: boolean = false;

    errorForm:boolean=false;
    messageForm:Message[]=[];
    classErrorUser:string="";
    classErrorPassword:string="";
    classErrorCompany:string="";
    classMessageForm:string="";

    

    constructor(
            public layoutService: LayoutService,
            private authService:AuthService, 
            private router: Router,
            private messageService: MessageService,
            private sapService:SAPService
            ) 
            {
                //importar al servicio de consulta de empresas
                this.authService.companies()
                .subscribe({
                next:(companies)=>{
                    //console.log(companies);
                    this.companies = companies;
                },
                error:(err)=>{
                    console.error(err);
                }
                });

                
            }
  
            

    onsubmit(){

        this.submitted = true;
        
        this.errorForm= false;
        this.messageForm=[];
        this.classMessageForm="";
        //console.log(this.username, this.password, this.selectedCompany);
        //console.log(this.companies.find(company => company.id==this.selectedCompany));
        
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
                    //console.log('Response',response);
                    //Obtener mensaje
                    //this.messageService.add({ severity: 'success', summary: '!Hola¡', detail: response.message, life: 3000 });
                    this.messageForm = [{severity:'success', summary:'', detail:response.message}];
                    //Obtener token y guardarlo en local storage
                    //localStorage.setItem('token',response.token!);
                    
                    localStorage.setItem('tokenid',response.tokenid!); 
                    
                    //Obtener infoUsuario
                    this.authService.loadInfoUsuario(response.tokenid!)
                        .subscribe({
                            next: (infoUsuario)=>{
                                //console.log(infoUsuario);
                                localStorage.setItem('infoUsuario',JSON.stringify(infoUsuario)); 
                            },
                            error: (err)=>{
                                console.error(err);
                            }
                        })
                    
                    //Obtener menuUsuario
                    this.authService.loadMenuUsuario(response.tokenid!)
                        .subscribe({
                            next: (menuUsuario)=>{
                                //console.log(menuUsuario);
                                localStorage.setItem('menuUsuario',JSON.stringify(menuUsuario)); 
                            },
                            error: (err)=>{
                                console.error(err);
                            }
                        });

                    //Obtener perfilesUsuario
                    this.authService.loadPerfilesUsuario(response.tokenid!)
                        .subscribe({
                            next: (perfilesUsuario)=>{
                                //console.log(perfilesUsuario);
                                localStorage.setItem('perfilesUsuario',JSON.stringify(perfilesUsuario)); 
                            },
                            error: (err)=>{
                                console.error(err);
                            }
                        })
                    
                    //Obtener permisosUsuario
                    this.authService.loadPemisosUsuario(response.tokenid!)
                        .subscribe({
                            next: (permisosUsuario)=>{
                                //console.log(permisosUsuario);
                                localStorage.setItem('permisosUsuario',JSON.stringify(permisosUsuario)); 
                            },
                            error: (err)=>{
                                console.error(err);
                            }
                        })

                    //redireccionar al main del portal
                    setTimeout(() => {  
                      //console.log("Redireccionar al portal"); 
                      this.router.navigate(['portal']);
                    }, 3500);
                  },
                  error:(err)=>{
                    console.error('Error',err.error.message);
                    this.classMessageForm = ' text-red-800';
    
                    this.messageForm = [{severity:'error', summary:'Error:', detail:err.error.message}];
                    //this.messageService.add({ severity: 'error', summary: '!Opps¡', detail: err.error.message, life: 3000 });
                  }
                });
        }else{
          this.messageForm = [{severity:'error', summary:'Error:', detail:'Los campos en rojo son obligatorios'}];
          //this.messageService.add({ severity: 'error', summary: '!Opps¡', detail: 'Los campos en rojo son obligatorios', life: 3000 });
        }

        this.submitted=false;
        
    }

    restoreClass(idControl:any):void{
        //console.log(idControl, this.username.length, this.password.length);
        this.messageForm =[];
        if(idControl=='password' && this.password.length!=0) this.classErrorPassword='';
        if(idControl=='username' && this.username.length!=0) this.classErrorUser='';
        if(idControl=='company' && typeof this.selectedCompany !== "undefined") this.classErrorCompany =''
      }
}

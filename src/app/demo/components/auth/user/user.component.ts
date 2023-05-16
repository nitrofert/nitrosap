import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-user',
  providers: [MessageService, ConfirmationService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  empresasUsuario:any[]=[];

  fullname:string ="";
  email:string ="";
  codusersap:string="";
  username:string ="";
  submitted:boolean = false;
  


  password:string ="";
  password2:string ="";

  urlBreadCrumb:string ="";

  constructor(private rutaActiva: ActivatedRoute,
   
    private adminService:AdminService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService) { }

  ngOnInit(): void {

    this.infoUsuario = this.authService.getInfoUsuario();
    this.fullname = this.infoUsuario.fullname;
    this.email = this.infoUsuario.email;
    this.codusersap = this.infoUsuario.codusersap;
    this.username = this.infoUsuario.username;
    //console.log(this.infoUsuario);
     
     //console.log(this.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     //console.log(this.router.url);
     //console.log(this.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     //console.log('Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     //this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
     

     this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
     this.urlBreadCrumb = this.router.url;

     this.getEmpresasUsuario();
     this.getInfoUsuario();
  }

  saveUser(){
    this.submitted = true;
    let userInfo:any = {
      id:this.infoUsuario.id,
      fullname:this.fullname,
      email:this.email
    }
    if(this.fullname && this.email){
        if(this.password.length>0 || this.password2.length>0){
            if(this.password.length==0 || this.password2.length==0){
              this.messageService.add({severity:'error', summary: '!Opps', detail: 'Debe diligenciar los campos resaltados en rojo'});
            }else if(this.password != this.password2){
              this.messageService.add({severity:'error', summary: '!Opps', detail: 'Las contraseñas ingresadas no coinciden'});
            }else{
              userInfo.password = this.password;
              this.actulizarInfoUsuario(userInfo);
              
            }
        }else{
          this.actulizarInfoUsuario(userInfo);
        }
    }else{
      //Error
      this.messageService.add({severity:'error', summary: '!Opps', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }
  }

  actulizarInfoUsuario(userInfo:any){

    console.log(userInfo);
    this.submitted = false;
    this.authService.actulizarInfoUsuario(this.authService.getToken(),userInfo)
        .subscribe({
          next: (result)=>{
              console.log(result);    
              if(result.affectedRows>0){
                let infoUsuario:any[] = []; 
                infoUsuario.push(this.authService.getInfoUsuario()) ;
                infoUsuario[0].fullname = userInfo.fullname;
                infoUsuario[0].email = userInfo.email;

                this.authService.setInfoUsuario(infoUsuario);
                this.messageService.add({severity:'success', summary: 'OK', detail: 'Se acutializo correctamente la información del usuario'});
                
              }  
          },
          error: (err)=>{
              console.log(err);
              this.messageService.add({severity:'error', summary: 'Error', detail: err});
          }
        });
  }

  getEmpresasUsuario(){
    this.authService.getEmpresasUsuario(this.authService.getToken())
        .subscribe({
          next: (empresas)=>{
              console.log(empresas);    
              this.empresasUsuario = empresas;        
          },
          error: (err)=>{
              console.log(err);
          }
        });
  }

  getInfoUsuario(){
    this.authService.loadInfoUsuario(this.authService.getToken())
        .subscribe({
          next: (infoUsuario)=>{
              console.log(infoUsuario);    
                     
          },
          error: (err)=>{
              console.log(err);
          }
        });
  }

}

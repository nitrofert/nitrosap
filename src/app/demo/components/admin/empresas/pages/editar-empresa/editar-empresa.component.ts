import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { PerfilInterface } from 'src/app/demo/api/perfil';
import { CompanyInterface } from 'src/app/demo/api/company';
import { AuthService } from 'src/app/demo/service/auth.service';


@Component({
  selector: 'app-editar-empresa',
  providers: [MessageService],
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.scss']
})
export class EditarEmpresaComponent implements OnInit {

  companySelected:any ;

  companyname:  string="";
  status:       string="";
  urlwsmysql:   string="";
  logoempresa:  string="";
  urlwssap:     string="";
  dbcompanysap: string="";
  

  submitted: boolean = false;



  messageForm:Message[]=[];
  submitBotton = false;

  estados = [
        { name: 'Activo', code: 'A' },
        { name: 'Inactivo', code: 'I' }
       
    ];

  /*infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";*/

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              private authService:AuthService) { }

  ngOnInit(): void {
    
    this.companySelected = this.rutaActiva.snapshot.params;
    //console.log((this.companySelected.company));

    /*his.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/

    this.adminService.getCompanyById(this.authService.getToken(),this.companySelected.company)
    .subscribe({
      next:(company =>{
          
          //console.log(company);
          this.companyname = company[0].companyname;
          this.status = company[0].status;
          this.logoempresa = company[0].logoempresa;
          this.urlwsmysql = company[0].urlwsmysql;
          this.urlwssap = company[0].urlwssap || '';
          this.dbcompanysap = company[0].dbcompanysap || '';
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.error(err);
      })
    });

  }

  saveCompany(){
    this.submitted=true;
    if (!this.companyname || !this.urlwsmysql || !this.urlwssap || !this.status || !this.dbcompanysap) {
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else{
      this.submitBotton = true;
    
      //Registrar menu
      const newCompany:CompanyInterface = {
        id:this.companySelected.company,
        companyname:this.companyname,
        status:this.status,
        logoempresa:this.logoempresa,
        urlwsmysql:this.urlwsmysql,
        urlwssap:this.urlwssap,
        dbcompanysap:this.dbcompanysap
      }
      
      this.adminService.updateCompany(this.authService.getToken(),newCompany)
      .subscribe({
        next:(company =>{
            
            //console.log(company);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado la empresa ${this.companyname}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.error(err);
        })
      });
      
    }

  }


  clear(){
    this.submitBotton = false;
    this.companyname="";
    this.status="";
    this.logoempresa="";
    this.urlwsmysql="";
    this.urlwssap="";
    this.dbcompanysap="";
  }

}

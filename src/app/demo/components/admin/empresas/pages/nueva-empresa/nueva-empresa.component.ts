import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { CompanyInterface } from 'src/app/demo/api/company';

import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';

@Component({
  selector: 'app-nueva-empresa',
  providers: [MessageService],
  templateUrl: './nueva-empresa.component.html',
  styleUrls: ['./nueva-empresa.component.scss']
})
export class NuevaEmpresaComponent implements OnInit {

  companyname:  string="";
  status:       string="";
  urlwsmysql:   string="";
  logoempresa:  string="";
  urlwssap:     string="";
  dbcompanysap: string="";

  submitted: boolean = false;
  messageForm: Message[] = [];
  submitBotton = false;

  estados = [
    { name: 'Activo', code: 'A' },
    { name: 'Inactivo', code: 'I' }

  ];

  infoSessionStr: string = "";
  infoSession: InfoUsuario[] = [];
  token: string = "";

  constructor(private messageService: MessageService,
    private adminService: AdminService) { }

  ngOnInit(): void {

    this.infoSessionStr = localStorage.getItem('infoSession') || '';
    this.infoSession = JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';

  }

  saveCompany() {
    this.submitted = true;
    if (!this.companyname || !this.urlwsmysql || !this.urlwssap || !this.status) {
      //error
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Debe diligenciar los campos resaltados en rojo', life: 3000 }];
    } else {
      this.submitBotton = true;
      
      //Registrar menu
      const newCompany: CompanyInterface = {
        companyname: this.companyname,
        status:this.status,
        urlwsmysql:this.urlwsmysql,
        logoempresa:this.logoempresa,
        urlwssap:this.urlwssap || '',
        dbcompanysap:this.dbcompanysap
      }

      this.adminService.saveCompany(this.token, newCompany)
        .subscribe({
          next: (company => {

            console.log(company);
            this.messageForm = [{ severity: 'success', summary: '!Genial¡', detail: `Ha registrado en el perfil ${this.companyname}`, life: 3000 }];
          }),
          error: (err => {
            this.submitBotton = false;
            console.log(err);
          })
        });

    }


    //this.submitted=false;
  }



  clear() {
    this.submitBotton = false;
    this.submitted = false;
    this.companyname = "";
    this.status = "";
    this.logoempresa = "";
    this.urlwsmysql = "";
    this.urlwssap = "";
    this.dbcompanysap = "";
    
  }
}


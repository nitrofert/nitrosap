import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { PerfilInterface } from 'src/app/demo/api/perfil';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-nuevo-perfil',
  providers: [MessageService],
  templateUrl: './nuevo-perfil.component.html',
  styleUrls: ['./nuevo-perfil.component.scss']
})
export class NuevoPerfilComponent implements OnInit {

  perfil: string = "";
  description: string = "";
  estado: string = "";
  submitted: boolean = false;
  messageForm: Message[] = [];
  submitBotton = false;

  estados = [
    { name: 'Activo', code: 'A' },
    { name: 'Inactivo', code: 'I' }

  ];

  /*infoSessionStr: string = "";
  infoSession: InfoUsuario[] = [];
  token: string = "";*/

  constructor(private messageService: MessageService,
    private adminService: AdminService,
    private authService: AuthService) { }

  ngOnInit(): void {

    /*this.infoSessionStr = localStorage.getItem('infoSession') || '';
    this.infoSession = JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/

  }

  savePerfil() {
    this.submitted = true;
    if (!this.perfil || !this.estado) {
      //error
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Debe diligenciar los campos resaltados en rojo', life: 3000 }];
    } else {
      this.submitBotton = true;
      
      //Registrar menu
      const newPerfil: PerfilInterface = {
        perfil: this.perfil,
        description: this.description,
        estado: this.estado

      }

      this.adminService.savePerfil(this.authService.getToken(), newPerfil)
        .subscribe({
          next: (perfil => {

            console.log(perfil);
            this.messageForm = [{ severity: 'success', summary: '!Genial¡', detail: `Ha registrado en el perfil ${this.perfil}`, life: 3000 }];
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
    this.perfil = "";
    this.description = "";
    this.estado = "";
    
  }
}


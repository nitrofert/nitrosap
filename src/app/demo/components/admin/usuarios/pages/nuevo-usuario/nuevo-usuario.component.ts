import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';


import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { UserInterface } from 'src/app/demo/api/users';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-nuevo-usuario',
  providers: [MessageService],
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
  styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
        }
    `]
})
export class NuevoUsuarioComponent implements OnInit {

  fullname:  string="";
  email:       string="";
  username:   string="";
  codusersap:  string="";
  password:     string="";
  password2:string = "";
  status: string="";

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

  saveUser() {
    this.submitted = true;
    if (!this.fullname || !this.email ||  !this.username || !this.codusersap || !this.password || !this.status) {
      //error
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Debe diligenciar los campos resaltados en rojo', life: 3000 }];
    }else if(this.password != this.password2){
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Las contraseñas no conciden', life: 3000 }];
    }else{
      this.submitBotton = true;
      
      //Registrar menu
      const newUser: UserInterface = {
        fullname: this.fullname,
        email: this.email,
        username: this.username,
        password: this.password,
        codusersap: this.codusersap,
        status: this.status

      }

      this.adminService.saveUser(this.authService.getToken(), newUser)
        .subscribe({
          next: (user => {

            console.log(user);
            this.messageForm = [{ severity: 'success', summary: '!Genial¡', detail: `Ha registrado el usuario ${this.fullname}`, life: 3000 }];
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
    this.fullname = "";
    this.status = "";
    this.email = "";
    this.username = "";
    this.password =  "";
    this.codusersap = "";

    
  }
}


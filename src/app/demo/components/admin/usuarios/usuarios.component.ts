import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';
import { AuthService } from 'src/app/demo/service/auth.service';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-usuarios',
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class UsuariosComponent implements OnInit {


  users:UserInterface[] = [];
  loading: boolean = true;

  selectedUser:UserInterface[] =[];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private adminService:AdminService,
              private router:Router,
              private authService:AuthService) { }

  ngOnInit(): void {

     //obtener datos del usuario logueado
     /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
     const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
     const token = localStorage.getItem('token') || '';*/

    this.adminService.listUsuarios(this.authService.getToken())
        .subscribe({
          next:(users =>{
            this.loading = false;
              console.log(users);
              this.users = users;
          }),
          error:(err =>{
            console.log(err);
          })
        });
  }

  newUser(){
    
    this.router.navigate(['/portal/admin/usuarios/nuevo']);
  }

  editUser(){
    console.log(this.selectedUser[0].id);
    this.router.navigate(['/portal/admin/usuarios/editar',this.selectedUser[0].id]);
  }
  companyUser(){
    console.log(this.selectedUser[0].id);
    this.router.navigate(['/portal/admin/usuarios/empresas',this.selectedUser[0].id]);
  }

  perfilUser(){
    console.log(this.selectedUser[0].id);
    this.router.navigate(['/portal/admin/usuarios/perfiles',this.selectedUser[0].id]);
  }
  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Router } from '@angular/router';
import { PerfilInterface } from 'src/app/demo/api/perfil';
import { PermisosInterface } from 'src/app/demo/api/permiso';

interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-permisos',
  providers: [MessageService, ConfirmationService],
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
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
export class PermisosComponent implements OnInit {

   permisos:PermisosInterface[] = [];
  loading: boolean = true;

  selecetedPermiso:PermisosInterface[] = [];

  estado:number = 0;

  estados:any[] = [{label: 'No', value: 0}, {label: 'Si', value: 1}];

  @ViewChild('filter') filter!: ElementRef;

   //obtener datos del usuario logueado
   infoSessionStr:string="";
   infoSession:InfoUsuario[]=[];
   token:string = "";


  constructor(private adminService:AdminService,
              private router:Router) { }

  ngOnInit(): void {

     //obtener datos del usuario logueado
     this.infoSessionStr = localStorage.getItem('infoSession') ||'';
     this.infoSession    =  JSON.parse(this.infoSessionStr);
     this.token = localStorage.getItem('token') || '';

    this.adminService.listPermisos(this.token)
        .subscribe({
          next:(permisos =>{
            this.loading = false;
              console.log(permisos);
              this.permisos = permisos;
          }),
          error:(err =>{
            console.log(err);
          })
        });
  }

  setPermiso(idPerfil:number, idMenu:number,valor:number,accion:string){
    
    const permiso:PermisosInterface = {
      idMenu,
      idPerfil,
      accion,
      valor
    }
    console.log(permiso);
    this.adminService.setPermiso(this.token,permiso)
      .subscribe({
        next:(permisos)=>{
          console.log(permisos);
        },
        error:(err)=>{
          console.log(err);
        }
      })
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

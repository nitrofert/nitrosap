import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Router } from '@angular/router';
import { PerfilInterface } from 'src/app/demo/api/perfil';
import { AuthService } from 'src/app/demo/service/auth.service';

interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-perfiles',
  providers: [MessageService, ConfirmationService],
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss'],
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
export class PerfilesComponent implements OnInit {

  perfil:PerfilInterface[] = [];
  loading: boolean = true;

  selectedPerfil:PerfilInterface[] =[];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private adminService:AdminService,
              private router:Router,
              private authService:AuthService) { }

  ngOnInit(): void {

     //obtener datos del usuario logueado
     /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
     const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
     const token = localStorage.getItem('token') || '';*/

    this.adminService.listPerfil(this.authService.getToken())
        .subscribe({
          next:(perfil =>{
            this.loading = false;
              //console.log(perfil);
              this.perfil = perfil;
          }),
          error:(err =>{
            console.error(err);
          })
        });
  }

  newPerfil(){
    //console.log('Nuevo perfil');
    this.router.navigate(['/portal/admin/perfiles/nuevo']);
  }

  editPerfil(){
    
    this.router.navigate(['/portal/admin/perfiles/editar',this.selectedPerfil[0].id]);
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

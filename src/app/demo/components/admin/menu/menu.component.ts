import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuInterface } from 'src/app/demo/api/menu.interface';
import { AdminService } from 'src/app/demo/service/admin.service';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-menu',
  providers: [MessageService, ConfirmationService],
  templateUrl: './menu.component.html',
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
export class MenuComponent implements OnInit {

  menu:MenuInterface[] = [];
  loading: boolean = true;

  selectedMenu:MenuInterface[] =[];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private adminService:AdminService,
              private router:Router,
              private authService:AuthService) { }

  ngOnInit(): void {

     //obtener datos del usuario logueado
     /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
     const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
     const token = localStorage.getItem('token') || '';*/

    this.adminService.listMenu(this.authService.getTokenid())
        .subscribe({
          next:(menu =>{
            this.loading = false;
              //console.log(menu);
              this.menu = menu;
          }),
          error:(err =>{
            console.log(err);
          })
        });
  }

  newMenu(){
    console.log('Nuevo menú');
    this.router.navigate(['/portal/admin/menu/nuevo']);
  }

  editMenu(){
    
    this.router.navigate(['/portal/admin/menu/editar',this.selectedMenu[0].id]);
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

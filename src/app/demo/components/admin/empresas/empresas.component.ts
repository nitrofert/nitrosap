import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Router } from '@angular/router';
import { CompanyInterface } from 'src/app/demo/api/company';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-empresas',
  providers: [MessageService, ConfirmationService],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
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
export class EmpresasComponent implements OnInit {

  company:CompanyInterface[] = [];
  loading: boolean = true;

  selectedCompany:CompanyInterface[] =[];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private adminService:AdminService,
              private router:Router) { }

  ngOnInit(): void {

     //obtener datos del usuario logueado
     let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
     const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
     const token = localStorage.getItem('token') || '';

    this.adminService.listCompanies(token)
        .subscribe({
          next:(company =>{
            this.loading = false;
              console.log(company);
              this.company = company;
          }),
          error:(err =>{
            console.log(err);
          })
        });
  }

  newCompany(){
    
    this.router.navigate(['/portal/admin/empresas/nuevo']);
  }

  editCompany(){
    
    this.router.navigate(['/portal/admin/empresas/editar',this.selectedCompany[0].id]);
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

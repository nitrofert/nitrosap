import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-cuentas-dependencia',
  providers: [MessageService, ConfirmationService],
  templateUrl: './cuentas-dependencia.component.html',
  styleUrls: ['./cuentas-dependencia.component.scss'],
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
export class CuentasDependenciaComponent implements OnInit {

  urlBreadCrumb:string ="";
  infoUsuario!:InfoUsuario;
  perfilesUsuario!:PerfilesUsuario[];
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];

  loading:boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  dataTable:any[] = [];
  selectedLine!:any;

  displayModal:boolean = false; 

  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private sapService:SAPService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService) { }

  ngOnInit(){

     //obtener datos del usuario logueado
     this.infoUsuario = this.authService.getInfoUsuario();
     
     //////console.logthis.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     //////console.logthis.router.url);
     //////console.logthis.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     //this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
     

     this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
     //console.log(this.permisosUsuarioPagina);
     //console.log(await this.authService.permisosPagina(this.permisosPerfilesPagina));
     this.urlBreadCrumb = this.router.url;

  this.getCuentasDependencias();

  }

  getCuentasDependencias(){
      this.sapService.cuentasPorDependenciaMysql(this.authService.getToken())
          .subscribe({
              next:(cuentas)=>{
                console.log(cuentas);
                this.dataTable = cuentas;
                this.loading = false;
              },
              error:(err)=>{
                console.error(err);
              }
          })
  }

  newCuentaDependencia(){
    
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.dataTable);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `cuentas-dependencia`);
    });
  }  

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

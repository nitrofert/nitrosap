import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import { FormPrecioItemComponent } from '../form-precio-item/form-precio-item.component';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-lista-precios-item-mp',
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './lista-precios-item-mp.component.html',
  styleUrls: ['./lista-precios-item-mp.component.scss']
})
export class ListaPreciosItemMpComponent  implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  listaPreciosMP:any[] = [];
  selectedLine:any[] = [];
  loading:boolean = false;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  urlBreadCrumb:string ="";
  infoUsuario!:InfoUsuario;

  displayModal:boolean = false;
  loadingCargue:boolean = false;

  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private sapService:SAPService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private authService: AuthService,
    public dialogService: DialogService,) { }

  ngOnInit(): void {

    this.infoUsuario = this.authService.getInfoUsuario();
     
    //////console.logthis.authService.getPerfilesUsuario());
    this.perfilesUsuario = this.authService.getPerfilesUsuario();

    //////console.logthis.router.url);
    //////console.logthis.authService.getPermisosUsuario());
    this.permisosUsuario = this.authService.getPermisosUsuario();
    //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
    this.urlBreadCrumb = this.router.url;

  }

  nuevoPrecioItem(){

    const ref = this.dialogService.open(FormPrecioItemComponent, {
      
      header: `Nueva lista de precios ` ,
      width: '60%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
       
    });




    ref.onClose.subscribe(() => {
      //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
      //this.getCalendar();
      //console.log(("Refresh calendar");
    });

  }

  

  editarPrecioItem(){}

  anularPrecioItem(){}



  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listaPreciosMP);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `solpeds`);
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { DialogService } from 'primeng/dynamicdialog';
import { FormPrecioItemComponent } from '../form-precio-item/form-precio-item.component';
import { FormCalculadoraPrecioComponent } from '../form-calculadora-precio/form-calculadora-precio.component';


@Component({
  selector: 'app-calculadora-precios',
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './calculadora-precios.component.html',
  styleUrls: ['./calculadora-precios.component.scss']
})
export class CalculadoraPreciosComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  infoCalculada:any[] = [];
  selectedLine:any[] = [];
  loading:boolean = false;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];
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
    public authService: AuthService,
    public dialogService: DialogService,) { }

  ngOnInit(): void {

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
    
    this.urlBreadCrumb = this.router.url;

   

    this.listaPreciosCalculados();

  }

  listaPreciosCalculados(){
      this.comprasService.listaPreciosCalculados(this.authService.getToken())
          .subscribe({
              next:(listaPreciosCalculados)=>{
                this.infoCalculada = listaPreciosCalculados;
              },
              error:(err)=>{
                  console.error(err);
              }
          });
  }

  nuevoCalculoPrecioItem(){

    /*const ref = this.dialogService.open(FormCalculadoraPrecioComponent, {
      
      header: `Nuevo calculo precio item ` ,
      width: '80%',

      height:'auto',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      
       
    });

    ref.onClose.subscribe(() => {
      //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
      //this.getCalendar();
      //console.log(("Refresh calendar");
    });*/

    this.router.navigate(['/portal/compras/mrp/calculadora-precios/nuevo-calculo']);
    //this.router.navigate(['/portal/compras/solped/nueva']);

  }

  

  editarPrecioItem(linea:any){
    console.log(linea);
    this.router.navigate(['/portal/compras/mrp/calculadora-precios/editar-calculo/'+linea[0].id]);
  }

  anularPrecioItem(){}



  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.infoCalculada);
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

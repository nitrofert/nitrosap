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
import { FormPrecioItemPtComponent } from '../form-precio-item-pt/form-precio-item-pt.component';

@Component({
  selector: 'app-lista-precios-item-pt',
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './lista-precios-item-pt.component.html',
  styleUrls: ['./lista-precios-item-pt.component.scss']
})
export class ListaPreciosItemPtComponent  implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  listaPreciosPT:any[] = [];
  selectedLine:any[] = [];
  loading:boolean = true;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  urlBreadCrumb:string ="";
  infoUsuario!:InfoUsuario;

  displayModal:boolean = false;
  loadingCargue:boolean = false;

  formularioCSV:boolean = false;
  loadingCargueCSV:boolean = false;

  lineasPrecioMercado:any[] = [];
  fileTmp2:any;
  separadorLista:string =";";
  uploadedFiles2: any[] = [];

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

    this.getListaPreciosPT();

  }

  nuevoPrecioItem(){

    const ref = this.dialogService.open(FormPrecioItemPtComponent, {
      
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

  getListaPreciosPT(){
    this.loading = true;
    this.comprasService.getListaPreciosPT(this.authService.getToken())
        .subscribe({
           next:(items)=>{
              console.log(items);
              this.listaPreciosPT= items;
              this.loading = false;
              },
           error:(err)=>{
              console.error(err);
           }
        });
  }

  editarPrecioItem(){}

  anularPrecioItem(){}

  cargarLPMercado(){
    this.formularioCSV = true;
  }

  onLoad2($event:any){

  
    this.loadingCargueCSV = true;
    const [ file ] = $event.currentFiles;
    this.fileTmp2 = {
      fileRaw:file,
      fileName:file.name
    }
    this.readDocument(file);
  
  }

  readDocument(file:Blob) {
    let fileReader = new FileReader();
    let arrayTexto:any[] =[];
    fileReader.onload = (e) => {
      let text:any =fileReader.result ;
      var lines = text.split('\n') ;
      for(let line of lines){
        console.log(line);
        //arrayTexto.push(this.reemplazarCaracteresEspeciales(line));

        let arrayLinea = line.split(";");

        /*this.lineasPrecioMercado.push({
          fechasemana:arrayLinea[0],
          semana:arrayLinea[1],
          itemcode:arrayLinea[2],
          codigozona:arrayLinea[3],
          cantidad:arrayLinea[4]
        });*/

      }
      this.loadingCargueCSV = false;
      //this.validarArchivoDetalle(arrayTexto);
    }
    fileReader.readAsText(file);
}

adicionarCSV(){
  this.loadingCargueCSV=true;
  this.loading = true;
 //if(this.lineasPrecioMercado.length>0){
    console.log(this.lineasPrecioMercado);
    
    let body = new FormData();

    console.log('fileTmp2',this.fileTmp2);
    body.append('separador',this.separadorLista);
    body.append('myFileLP', this.fileTmp2.fileRaw, this.fileTmp2.fileName); 

    

        this.comprasService.cargarLPMercado(this.authService.getToken(),body)
        .subscribe({
          next: (result:any)=>{
            console.log(result);
            this.messageService.add({severity:'success', summary: '!Ok', detail: result.message});
            this.formularioCSV = false;
            this.getListaPreciosPT();

            //this.getItems();
          },
          error: (err)=>{
            console.log('Error',err);
            this.messageService.add({severity:'error', summary: '!Error', detail: 'Error en cargue del listado de precios: '+err});
            this.loadingCargueCSV=false;
          }
        });


    
    
  //}
  
}

descargarCSV(){}


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listaPreciosPT);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Lista de precios PT`);
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

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

  lineasPrecioMP:any[] = [];
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
    //his.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
    this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
     

    this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
    //console.log(this.permisosUsuarioPagina);
    this.urlBreadCrumb = this.router.url;

    this.getListaPreciosMP();

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

  getListaPreciosMP(){
    this.loading = true;
    this.comprasService.getListaPreciosMP(this.authService.getToken())
        .subscribe({
           next:(items)=>{
              console.log(items);
              this.listaPreciosMP= items;
              this.loading = false;
              },
           error:(err)=>{
              console.error(err);
           }
        });
  }

  editarPrecioItem(){}

  anularPrecioItem(){}

  cargarLPMP(){
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
    console.log(this.lineasPrecioMP);
    
    let body = new FormData();

    console.log('fileTmp2',this.fileTmp2);
    body.append('separador',this.separadorLista);
    body.append('myFileMP', this.fileTmp2.fileRaw, this.fileTmp2.fileName); 

    

        this.comprasService.cargarLPMP(this.authService.getToken(),body)
        .subscribe({
          next: (result:any)=>{
            console.log(result);
            this.messageService.add({severity:'success', summary: '!Ok', detail: result.message});
            this.formularioCSV = false;
            this.getListaPreciosMP();

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
        const worksheet = xlsx.utils.json_to_sheet(this.listaPreciosMP);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Lista de precios MP`);
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

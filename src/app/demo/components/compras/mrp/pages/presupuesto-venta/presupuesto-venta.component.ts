import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ItemsSAP } from 'src/app/demo/api/itemsSAP';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-presupuesto-venta',
  providers: [MessageService, ConfirmationService],
  templateUrl: './presupuesto-venta.component.html',
  styleUrls: ['./presupuesto-venta.component.scss'],
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
export class PresupuestoVentaComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;
  infoUsuario: any;
  perfilesUsuario: any;
  permisosUsuario: any;
  urlBreadCrumb!: string;
  permisosUsuarioPagina: any;
  presupuestos:any[] = [];
  presupuestoSeleccionado:any[] = [];
  loading:boolean = true;
  zonas:any[] = [{label:"Costa Norte",value:"900"},{label:"Costa Pacífico",value:"901"}];
  items:ItemsSAP[] = [];
  itemsMP:ItemsSAP[] = [];
  formularioCSV:boolean = false;
  loadingCargueCSV:boolean = false;
  cargueValido:boolean = false;
  fileTmp2:any;
  lineasPresupuestoCVS:any;
  uploadedFiles2: any[] = [];
  separadorLista:string ="";


  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private authService: AuthService,
    private sapService:SAPService) { }

  ngOnInit(): void {
    this.getItems();
     //Cargar informacion del usuario
     this.getInfoUsuario();
     //Cargar perfiles del usuario
     this.getPerfilesUsuario();
     //Cargar permisos del usuario
     this.getPermisosUsuario();
     //Cargar permisos usuario pagina
     this.getPermisosUsuarioPagina();

     
  }


  getInfoUsuario(){
    this.infoUsuario = this.authService.getInfoUsuario();
  }

  getPerfilesUsuario(){
    this.perfilesUsuario = this.authService.getPerfilesUsuario();
  }

  getPermisosUsuario(){
    this.permisosUsuario = this.authService.getPermisosUsuario();
  }

  getPermisosUsuarioPagina(){
    let url ="";
    //console.log("URL origen",this.router.url);
    //console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['entrada']){
      let entradaSeleccionada = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
      }
      //console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      //console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter((item: { url: string; }) => item.url===url);
    console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getItems(){
    this.sapService.itemsSAPXE(this.authService.getToken())
        .subscribe({
          next: (items) => {
            for(let item in items){
              this.items.push(items[item]);
              //Obtener items de materia prima
              if((items[item].ItemCode.toLowerCase().indexOf('mp')==0)){
                //console.log(items[item].ItemCode.toLowerCase());
                //Llenar el array de items de MP
                this.itemsMP.push(items[item]);
              }
           }
           console.log(this.itemsMP);
           this.getPresupeustoVenta();
           //console.log(this.itemsMP);
           
          },
          error: (error) => {
              //console.log(error);      
          }
        });
  }

  getPresupeustoVenta(){
    this.comprasService.getPresupuestosVentaAll(this.authService.getToken())
        .subscribe({
            next: (presupuesto)=>{
              //console.log(presupuesto);
              for(let linea of presupuesto){
                

                  if(this.items.filter(data =>data.ItemCode===linea.itemcode).length>0){
                    let item = this.items.filter(data =>data.ItemCode===linea.itemcode);
                    let zona = this.zonas.filter(data =>data.value === linea.codigozona);
                    //console.log(item[0]);
                    linea.descripcion = item[0].ItemName;
                    linea.zona = zona[0].label;
                  }else{
                    
                    console.log(linea.itemcode);
                  }
                  
              }
              this.presupuestos = presupuesto;
              this.loading = false;
            },
            error: (err) => {
              console.log(err);
            }
        });
  }


  cargarPresupuesto(){
    this.formularioCSV = true;
  }

  adicionarCSV(){
    this.loadingCargueCSV=true;
    if(this.lineasPresupuestoCVS.length>0){
      console.log(this.lineasPresupuestoCVS);

      let body = new FormData();

      console.log(this.fileTmp2);
      body.append('separador',this.separadorLista);
      body.append('myFile', this.fileTmp2.fileRaw, this.fileTmp2.fileName); 

      /*this.comprasService.cargarPresupuestoCVS(this.authService.getToken(),this.lineasPresupuestoCVS)
          .subscribe({
            next: (result:any)=>{
              console.log(result);
              this.messageService.add({severity:'success', summary: '!Ok', detail: result.message});
              this.formularioCSV = false;
              this.loading = true;
              this.getItems();
            },
            error: (err)=>{
              console.log(err);
            }
          });*/

          this.comprasService.cargarPresupuestoCVS2(this.authService.getToken(),body)
          .subscribe({
            next: (result:any)=>{
              console.log(result);
              this.messageService.add({severity:'success', summary: '!Ok', detail: result.message});
              this.formularioCSV = false;
              this.loading = true;
              this.getItems();
            },
            error: (err)=>{
              console.log(err);
            }
          });


      
      
    }
    
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
        //console.log(line);
        arrayTexto.push(this.reemplazarCaracteresEspeciales(line));
      }
      this.validarArchivoDetalle(arrayTexto);
    }
    fileReader.readAsText(file);
}

reemplazarCaracteresEspeciales(texto:string){
  return texto.replace('\r','').replace('\t','');
}


async validarArchivoDetalle(lienasArchivo:any){
  //console.log(lienasArchivo.length);
  if(this.validarEncabezado(lienasArchivo[0].split(","))){
    //validar contenido 
    this.cargueValido = await this.validarContenidoCSV(lienasArchivo,',');
    if(this.cargueValido){
      this.separadorLista = ",";
      this.messageService.add({severity:'success', summary: '!Ok', detail: 'El archivo cargado cumple con la estructura básica requerida'});
    }

  }else if(this.validarEncabezado(lienasArchivo[0].split(";"))){
    //validar contenido
    this.cargueValido = await this.validarContenidoCSV(lienasArchivo,';');
    if(this.cargueValido){
      this.separadorLista = ";";
      this.messageService.add({severity:'success', summary: '!Ok', detail: `El archivo cargado cumple con la estructura básica requerida. `});
    }
  }else{
    this.messageService.add({severity:'error', summary: '!Error', detail: `El archivo cargado no cumple con la estructura básica requerida. 5 Columnas 'FECHASEMANA',	'SEMANA',	'ITEM',	'CODIGOZONA',	'CANTIDAD'`});
  }


  
  this.loadingCargueCSV = false;
}

validarEncabezado(arrayLineaEncabezado:any[]){
  let camposEncabezado:any =['FECHASEMANA',	'SEMANA',	'ITEM',	'CODIGOZONA',	'CANTIDAD'];
  let valido = true;
  if(arrayLineaEncabezado.length != camposEncabezado.length){
    //this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo cargado no cumple con la estructura básica requerida'});
    valido = false;
  }else if(!this.encabezadosValidos(camposEncabezado,arrayLineaEncabezado)){
    //this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo cargado no cumple con la estructura básica requerida'});    
    valido = false;
  }

  return valido;
}

encabezadosValidos(camposEncabezado:any[], arrayLineaEncabezado:any[]){
    let valido = true;
    for(let encabezado of arrayLineaEncabezado){
        if(!camposEncabezado.includes(encabezado)){
          valido = false;
          break;
        }
    }
    return valido;
}

async validarContenidoCSV(lienasArchivo:any,separador:string):Promise<boolean>{
  let valido = true;
  //console.log(lienasArchivo);
  let arrayLinea:any;
  this.lineasPresupuestoCVS = [];
  
  let lineasProcesadas =0;
  let linetotal:any;
  let taxvalor:any;

  for(let linea = 1 ;linea < lienasArchivo.length; linea ++){
    
      arrayLinea = lienasArchivo[linea].split(separador);

      console.log(arrayLinea);
                
      if(arrayLinea.length==5){
        if(arrayLinea[0]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La fecha de la semana  de la linea ${linea}, no es obligatoria`});
          valido = false;
        }else if(arrayLinea[0]!='' && !arrayLinea[0].includes("-")){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La fecha de la semana  de la linea ${linea}, no es valida. Debe tener el formato YYYY-MM-DD`});
          valido = false;
        }else if(arrayLinea[0]!='' && isNaN(Date.parse(arrayLinea[0]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La fecha de la semana  de la linea ${linea}, no es valida`});
          valido = false;
        }else if(arrayLinea[1]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El número de la semana  de la linea ${linea} es obligatoria`});
          valido = false;
        }else if(arrayLinea[1]!='' && isNaN(arrayLinea[1])){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El número de la semana  de la linea ${linea} no es valido`});
          valido = false;
        }else if(arrayLinea[2]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del item de la linea ${linea}, es obligatorio`});
          valido = false;  
        }/*else if(arrayLinea[2]!='' && this.items.filter(item =>item.ItemCode==arrayLinea[2]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del item  de la linea ${linea}, no existe en el listado de items de SAP`});
          valido = false;
        }*/else if(arrayLinea[3]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la zona  de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[3]!='' && isNaN(arrayLinea[3])){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la zona  de la linea ${linea} no es valido`});
          valido = false;
        }else if(arrayLinea[3]!='' && this.zonas.filter(zona =>zona.value==arrayLinea[3]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la zona  de la linea ${linea} no existe en el listado zonas`});
          valido = false;
        }else if(arrayLinea[4]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El valor de la cantidad de consumo de la linea ${linea} es obligatorio`});
          valido = false;
        }/*else if(arrayLinea[4]!='' && (arrayLinea[4].toString().includes(","))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El valor de la cantidad de consumo  de la linea ${linea} no es valido. No debe contener (,)`});
          valido = false;
          
        }else if(arrayLinea[4]!='' && isNaN(eval(arrayLinea[4]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El valor de la cantidad de consumo  de la linea ${linea} no es valido`});
          valido = false;
          
        }*/else{
            // Linea Valida

            

            this.lineasPresupuestoCVS.push({
              fechasemana:arrayLinea[0],
              semana:arrayLinea[1],
              itemcode:arrayLinea[2],
              codigozona:arrayLinea[3],
              cantidad:arrayLinea[4]
            });
        }


        lineasProcesadas++;
      }else{
        if(arrayLinea.length>1){
          lineasProcesadas++;
          this.messageService.add({severity:'error', summary: '!Error', detail: `La líena ${linea} del archivo a cargar, no posee la estructura básica requerida`});
          valido = false;
        }
      }
      
       
  }
  
  console.log(lineasProcesadas);

  if(lineasProcesadas==0){
    this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo seleccionado no posse lineas para agregar a la solped'});
    valido = false;
  }

  return valido;

}



async descargarCSV(){
  /*this.comprasService.downloadAnexo3(this.authService.getToken(),'uploads/solped/plantilla cargue detalle solped.csv')
      .subscribe({
          next: (result)=>{
            console.log(result);
          },
          error: (err)=>{
              console.log(err);
          }
      })*/
  const link = document.createElement('a');
  //plantilla_maximos_minimos
  link.href = await this.comprasService.downloadAnexo('uploads/solped/plantilla_presupuesto_venta.csv');
  link.click();
  
  
}


exportExcel() {
  import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.presupuestos);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `maximos_minimos`);
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

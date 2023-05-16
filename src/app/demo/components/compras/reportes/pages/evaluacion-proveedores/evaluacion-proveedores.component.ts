import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BusinessPartners } from 'src/app/demo/api/businessPartners';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import * as FileSaver from 'file-saver';
//import {TreeNode} from 'primeng/api';



@Component({
  selector: 'app-evaluacion-proveedores',
  providers: [MessageService, ConfirmationService],
  templateUrl: './evaluacion-proveedores.component.html',
  styleUrls: ['./evaluacion-proveedores.component.scss']
})



export class EvaluacionProveedoresComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  urlBreadCrumb:string ="";
  url:string ="";

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  fechainicio:Date = new Date();
  fechafin:Date = new Date();

  reportes:any[] = [];

  proveedores:BusinessPartners[] = [];
  proveedor!:any;
  codigoProveedor:string = "";
  proveedoresFiltrados:BusinessPartners[] = [];

  tipos:any[] = [{name:"Bienes"},{name:"Servicios"}];
  tipo:any ="";

  proveedoresRpt:any[] =[];
  selectedItemProveedor:any[] = [];
  entradasRpt:any[]=[];
  selectedItemEntradas:any[] = [];

  loadingT1 = false;
  loadingT2 = false;


  constructor(private rutaActiva: ActivatedRoute,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService,
    private sapService:SAPService) { }


  ngOnInit(): void {

    //Cargar informacion del usuario
    this.getInfoUsuario();
    //Cargar perfiles del usuario
    this.getPerfilesUsuario();
    //Cargar permisos del usuario
    this.getPermisosUsuario();
    //Cargar permisos usuario pagina
    this.getPermisosUsuarioPagina();
    //Cargar reportes de compras segun permisos del usuario
    //this.getMenuReportes();

    this.getProveedores();

    
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
    //let url ="";
    //console.log("URL origen",this.router.url);
    //console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['entrada']){
      let entradaSeleccionada = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
        this.url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
      }
      console.log("URL con parametros: ",this.url);
    }else{
      this.url= this.router.url;
      console.log("URL sin parametros: ",this.url);
    }
    this.urlBreadCrumb = this.url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.url);
    //console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getProveedores(){
    this.sapService.BusinessPartnersXE(this.authService.getToken())
        .subscribe({
          next: (businessPartners) => {
            for(let item in businessPartners){
              this.proveedores.push(businessPartners[item]);
           }
          },
          error: (error) => {
              //console.log(error);      
          }
        });
  }

  filtrarProveedores(event:any){
    let filtered : any[] = [];
      let proveedores:any;
      let query = event.query;
      for(let i = 0; i < this.proveedores.length; i++) {
        proveedores = this.proveedores[i];
           if((proveedores.CardCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
              (proveedores.CardName.toLowerCase().indexOf(query.toLowerCase())>=0)){
              ////console.log(businessPartner);
              filtered.push(proveedores);
           }
      }
      this.proveedoresFiltrados = filtered;
  }

  reestablecerFiltro(){
    this.fechainicio = new Date();
    this.fechafin = new Date();
    this.tipo = "";
    this.proveedor ="";
    this.proveedoresRpt= [];
    this.entradasRpt =[];
    this.loadingT1 =false;
    this.loadingT2 =false;
  }

  filtar(){
    this.proveedoresRpt= [];
    this.entradasRpt =[];
    this.loadingT1 =true;
    console.log(this.fechainicio, this.fechafin, this.proveedor,this.codigoProveedor, this.tipo)
    if(Date.parse(this.fechafin.toDateString()) < Date.parse(this.fechainicio.toDateString())){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La fecha final no puede ser menor a la fecha inicial'});
    }else if(this.proveedor!=undefined && this.proveedor!='' && this.codigoProveedor=='' ){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar el proveedor'});
    }else{
          let parametros = {
            fechainicio:this.fechainicio,
            fechafin:this.fechafin,
            proveedor:this.proveedor==''||this.proveedor ==undefined?'':this.codigoProveedor,
            tipo:this.tipo
          }
          this.comprasService.evaluacionProveedores(this.authService.getToken(), parametros)
              .subscribe({
                  next: (rptEvaluacionProveedore) =>{
                    console.log(rptEvaluacionProveedore);
                    if(rptEvaluacionProveedore.length==0){
                      this.messageService.add({severity:'warn', summary: '!Informacion¡', detail: 'No se encontraron registros en la busqueda'});
                    }else{
                      this.proveedoresRpt = rptEvaluacionProveedore;
                    }
                    
                    this.loadingT1 =false;
                  },
                  error: (err)=>{
                    console.log(err);
                  }
              });
              
              
    }
    this.loadingT1 =false;
  }

  verDetalle(fila:any){
    console.log(fila);
    this.loadingT2 =true;

    let parametros = {
      fechainicio:this.fechainicio,
      fechafin:this.fechafin,
      proveedor:fila.CardCode,
      tipo:this.tipo
    }

    this.comprasService.detalleEntradasProveedor(this.authService.getToken(), parametros)
        .subscribe({
           next: (rptDetalleEntradas)=>{
              console.log(rptDetalleEntradas);
              this.entradasRpt = rptDetalleEntradas;
              this.loadingT2 =false;
           },
           error: (err)=>{
              console.log(err);
           }
        })
  }

  seleccionPrveeedor(event:any){
    console.log(event);
    
    this.codigoProveedor = this.proveedor.CardCode;
    console.log(this.proveedor,this.codigoProveedor);
  }

  exportExcel(listado:any,nombre:string) {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(listado);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `${nombre}`);
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

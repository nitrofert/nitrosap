import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { AuthService } from 'src/app/demo/service/auth.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-form-precio-item',
  templateUrl: './form-precio-item.component.html',
  styleUrls: ['./form-precio-item.component.scss']
})
export class FormPrecioItemComponent implements OnInit{

  @ViewChild('filter') filter!: ElementRef;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  
  infoUsuario!:InfoUsuario;

  
  displayModal:boolean = false;
  loadingCargue:boolean = false;


  fechaLista:Date = new Date();
  semanaMesLista:string ='0';
  semanaAnioLista:number =0;
  envioLista:boolean = false;

  listaItemsMP:any[] = [];
  selectedLineItem:any[] = [];
  loading:boolean = false;

  interesDia:number = 120; //Se obtiene de las variables globales
  prcInteres:number = 0.095; //Se obtiene de las variables globales
  precioEntregaMP:number = 15; //Se obtiene de las variables globales
  


  mesesAnio:any[] = [{mes:1, mesStr:'Enero'},
  {mes:2, mesStr:'Febrero'},
  {mes:3, mesStr:'Marzo'},
  {mes:4, mesStr:'Abril'},
  {mes:5, mesStr:'Mayo'},
  {mes:6, mesStr:'Junio'},
  {mes:7, mesStr:'Julio'},
  {mes:8, mesStr:'Agosto'},
  {mes:9, mesStr:'Septiembre'},
  {mes:10, mesStr:'Octubre'},
  {mes:11, mesStr:'Noviembre'},
  {mes:12, mesStr:'Diciembre'}];


  constructor(private authService: AuthService,
    private sapService:SAPService,
    private router:Router,
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute) {}


  async ngOnInit(): Promise<void> {

    this.infoUsuario = this.authService.getInfoUsuario();
     
    //////console.logthis.authService.getPerfilesUsuario());
    this.perfilesUsuario = this.authService.getPerfilesUsuario();

    //////console.logthis.router.url);
    //////console.logthis.authService.getPermisosUsuario());
    this.permisosUsuario = this.authService.getPermisosUsuario();
    //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);

    this.getItems();

    this.semanaAnioLista = await this.numeroDeSemana(new Date());
    this.semanaMesLista = await this.semanaDelMes(new Date());
    
  }


  getItems(){
      this.sapService.itemsMPSAPMysql(this.authService.getToken())
 
          .subscribe({
            next: (items) => {
              let itemsMP:any[] =[];
              for(let item in items){
               
                itemsMP.push({
                  ItemCode: items[item].ItemCode,
                  ItemName: items[item].ItemName,
                  precioExt:0,
                  precioNac:0,
                  tendencia:'Neutro',
                  class1: 'p-button-rounded p-button-text p-button-secondary',
                  class2: 'p-button-rounded p-button-text p-button-info',
                  class3: 'p-button-rounded p-button-text p-button-secondary'
                });
              }

              this.listaItemsMP = itemsMP;
            },
            error: (error) => {
                console.error(error);      
            }
          });
  }

  async calcularSemana(){
    this.semanaAnioLista = await this.numeroDeSemana(this.fechaLista);
    this.semanaMesLista = await this.semanaDelMes(this.fechaLista);
  }

  async fechaInicioSemana(fecha:Date):Promise<Date>{
    let fechaTMP:Date = new Date(fecha);
    let diaDeLaSemana = fecha.getUTCDay()==0?1:fecha.getUTCDay();
    let numeroDiasRestar = diaDeLaSemana-1;
    fechaTMP.setDate(fecha.getDate()-numeroDiasRestar);

    

    ////console.log(fecha, diaDeLaSemana,fecha.getDate(),numeroDiasRestar,fechaTMP);
    return fechaTMP;
  }

  async siguienteMes(fecha:Date){
    ////console.log(fecha,fecha.getFullYear(),fecha.getMonth());

    let anioMesSiguiente:number = fecha.getMonth()==11?fecha.getFullYear()+1:fecha.getFullYear();
    let mesMesSiguiente:number = fecha.getMonth()==11?0:fecha.getMonth()+1;
    ////console.log('año',anioMesSiguiente,'mes',mesMesSiguiente);
    let fechaInicioMesSiguiente = new Date(anioMesSiguiente, mesMesSiguiente,1);

    return fechaInicioMesSiguiente;
  }

  async semanaDelMes(fecha:Date):Promise<string>{
    let semanaMes:string ='';
    
    //let fechaInicioSemana = await this.fechaInicioSemana(new Date(fecha));
    let fechaInicioSemana = ((fecha));
    fechaInicioSemana.setHours(0,0,0);
    //console.log('Inicio semana',fechaInicioSemana);
    //let siguienteMes = await this.siguienteMes(new Date(fecha));
    let siguienteMes = await this.siguienteMes((fecha));
    siguienteMes.setHours(0,0,0);
    //console.log('Siguiente mes',siguienteMes);

    let fechaInicioSemanaSiguienteMes = await this.fechaInicioSemana((siguienteMes));
    fechaInicioSemanaSiguienteMes.setHours(0,0,0);
    //console.log('fecha Inicio Semana Siguiente mes',fechaInicioSemanaSiguienteMes);
    //await console.log(fechaInicioSemana.getFullYear(),fechaInicioSemanaSiguienteMes.getFullYear(),fechaInicioSemana.getMonth(),fechaInicioSemanaSiguienteMes.getMonth(),fechaInicioSemana.getDate(),fechaInicioSemanaSiguienteMes.getDate());

    
    let diaDelMes = fechaInicioSemana.getDate();
    let diaFecha = fechaInicioSemana.getDay();

    
    let weekOfMonth = Math.ceil((diaDelMes - 1 - diaFecha) / 7);
    ////console.log(`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,weekOfMonth+1);
    let mesStr = this.mesesAnio.filter(mes =>mes.mes === (fechaInicioSemana.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    
    if(fechaInicioSemana.getFullYear()===fechaInicioSemanaSiguienteMes.getFullYear() && fechaInicioSemana.getMonth() === fechaInicioSemanaSiguienteMes.getMonth() && fechaInicioSemana.getDate()===fechaInicioSemanaSiguienteMes.getDate()){
      weekOfMonth = 0;
      mesStr = this.mesesAnio.filter(mes =>mes.mes === (siguienteMes.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    }

    semanaMes = `${(weekOfMonth+1)}S - ${mesStr}`;

    return semanaMes;
  }

  async numeroDeSemana(fecha:any):Promise<number>{
    const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24,
          DIAS_SEMANA = 7,
          JUEVES = 4;

    //let nuevaFecha:Date;
    fecha = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    let diaDeLaSemana = fecha.getUTCDay(); // Domingo es 0, sábado es 6
    if (diaDeLaSemana === 0) {
        diaDeLaSemana = 7;
    }
    fecha.setUTCDate(fecha.getUTCDate() - diaDeLaSemana + JUEVES);
    const inicioDelAño:any = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
    const diferenciaDeFechasEnMilisegundos = fecha - inicioDelAño;
    return Math.ceil(((diferenciaDeFechasEnMilisegundos / DIA_EN_MILISEGUNDOS) + 1) / DIAS_SEMANA);
  }

  PresionaEnter(event:any,itemCode:any){
    
    if (event.key === "Enter") {
      
      ////console.log('ENTER PRESS');
      if(event.target.value ===''){
        event.target.value =0;
      }
      this.calcularPrecioNT(event.target.value,itemCode);
    }
  }

  cambio(event:any,itemCode:any){
    ////console.log(event.target.value);
    if(event.target.value ===''){
      event.target.value =0;
    }
       this.calcularPrecioNT(event.target.value,itemCode);
  }

  calcularPrecioNT(precio:any, itemCode:any){
    console.log(precio,  itemCode);
    let interesMP = parseFloat(precio)*((this.interesDia/365)*this.prcInteres);
    let precioMPNT = parseFloat(precio) + this.precioEntregaMP + interesMP;

    let indexItemsMP = this.listaItemsMP.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsMP[indexItemsMP].precioNac = precioMPNT;

    //console.log(precioMPNT);
  }

  alza(itemCode:any){

  }

  neutro(itemCode:any){

  }

  baja(itemCode:any){

  }


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listaItemsMP);
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

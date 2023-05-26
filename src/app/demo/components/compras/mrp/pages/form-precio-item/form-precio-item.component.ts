import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-form-precio-item',
  providers: [MessageService, ConfirmationService],
  templateUrl: './form-precio-item.component.html',
  styleUrls: ['./form-precio-item.component.scss']
})
export class FormPrecioItemComponent implements OnInit{

  @ViewChild('filter') filter!: ElementRef;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];
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


  parametros:any[] = [];
  interesDia:number = 0; //Se obtiene de las variables globales
  prcInteres:number = 0; //Se obtiene de las variables globales
  precioEntregaMP:number = 0; //Se obtiene de las variables globales


  itemsMPSemana:any[] = [];
  formParametrosG:boolean = false;


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


  constructor(public authService: AuthService,
    private sapService:SAPService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute,
    private comprasService: ComprasService,) {}


  async ngOnInit(): Promise<void> {

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

    

    this.semanaAnioLista = await this.numeroDeSemana(new Date());
    this.semanaMesLista = await this.semanaDelMes(new Date());

    this.getItemsMPSemana(this.semanaAnioLista);
    this.getParametrosMP();
  }

  getParametrosMP(){
      this.comprasService.getParametrosMP(this.authService.getToken())
          .subscribe({
              next:async (parametros)=>{
                  console.log(parametros);
                  this.parametros = parametros;
                  await this.setVariablesParametros();
              },
              error:(err)=>{
                  console.error(err);
              }
          })
      
  }

  async setVariablesParametros(){
    this.interesDia = parseFloat(this.parametros.filter(parametro => parametro.codigo==='INTDIA')[0].valor);
    this.prcInteres= parseFloat(this.parametros.filter(parametro => parametro.codigo==='PRCINT')[0].valor);
    this.precioEntregaMP= parseFloat(this.parametros.filter(parametro => parametro.codigo==='PRCENT')[0].valor);
  }

  getItemsMPSemana(semana:number){
    this.comprasService.getItemsMPSemana(this.authService.getToken(),semana)
        .subscribe({
           next:(items)=>{
              console.log(items);
              this.itemsMPSemana = items;
              this.getItems();
           },
           error:(error)=>{
              console.error(error);
           }
        });
  }


  getItems(){
      this.sapService.itemsMPSAPMysql(this.authService.getToken())
 
          .subscribe({
            next: (items) => {
              let itemsMP:any[] =[];
              for(let item in items){
                console.log(items[item]);
                let precioExtItemSemana = 0;
                let precioNacItemSemana = 0;
                let tendenciaItemSemana = 'Neutro';

                if(this.itemsMPSemana.filter(itemMP =>itemMP.ItemCode == items[item].ItemCode).length>0){
                  precioExtItemSemana = this.itemsMPSemana.filter(itemMP =>itemMP.ItemCode == items[item].ItemCode)[0].precioExt;
                  precioNacItemSemana = this.itemsMPSemana.filter(itemMP =>itemMP.ItemCode == items[item].ItemCode)[0].precioNac;
                  tendenciaItemSemana = this.itemsMPSemana.filter(itemMP =>itemMP.ItemCode == items[item].ItemCode)[0].tendencia;
                }
                itemsMP.push({
                  ItemCode: items[item].ItemCode,
                  ItemName: items[item].ItemName,
                  precioExt:precioExtItemSemana,
                  precioNac:precioNacItemSemana,
                  tendencia:tendenciaItemSemana,
                  class1: tendenciaItemSemana=='Alza'?'p-button-rounded p-button-text p-button-success ':'p-button-rounded p-button-text p-button-secondary',
                  class2: tendenciaItemSemana=='Neutro'?'p-button-rounded p-button-text p-button-info ':'p-button-rounded p-button-text p-button-secondary',
                  class3: tendenciaItemSemana=='Baja'?'p-button-rounded p-button-text p-button-danger ':'p-button-rounded p-button-text p-button-secondary'
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
    this.getItemsMPSemana(this.semanaAnioLista);
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
    
    let interesMP = 0;
    let precioMPNT = 0;
    
    if(precio!=0){
      interesMP = parseFloat(precio)*((this.interesDia/365)*this.prcInteres);
      precioMPNT = parseFloat(precio) + this.precioEntregaMP + interesMP;
    }

    let indexItemsMP = this.listaItemsMP.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsMP[indexItemsMP].precioNac = precioMPNT;

    //console.log(precioMPNT);
  }

  alza(itemCode:any){
    let indexItemsMP = this.listaItemsMP.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsMP[indexItemsMP].class1 = 'p-button-rounded p-button-text p-button-success ';
    this.listaItemsMP[indexItemsMP].class2 = 'p-button-rounded p-button-text p-button-secondary';
    this.listaItemsMP[indexItemsMP].class3 = 'p-button-rounded p-button-text p-button-secondary';
    this.listaItemsMP[indexItemsMP].tendencia = 'Alza';

  }

  neutro(itemCode:any){
    let indexItemsMP = this.listaItemsMP.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsMP[indexItemsMP].class1 = 'p-button-rounded p-button-text p-button-secondary ';
    this.listaItemsMP[indexItemsMP].class2 = 'p-button-rounded p-button-text p-button-info';
    this.listaItemsMP[indexItemsMP].class3 = 'p-button-rounded p-button-text p-button-secondary';
    this.listaItemsMP[indexItemsMP].tendencia = 'Neutro';

  }

  baja(itemCode:any){
    let indexItemsMP = this.listaItemsMP.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsMP[indexItemsMP].class1 = 'p-button-rounded p-button-text p-button-secondary ';
    this.listaItemsMP[indexItemsMP].class2 = 'p-button-rounded p-button-text p-button-secondary';
    this.listaItemsMP[indexItemsMP].class3 = 'p-button-rounded p-button-text p-button-danger';
    this.listaItemsMP[indexItemsMP].tendencia = 'Baja';

  }

  grabarListaPreciosMP(){
   
    if( this.listaItemsMP.filter(item=>item.precioExt !=0).length===0){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe ingresar por lo menos el precio de un item'});
    }else{
      console.log(this.fechaLista,this.semanaAnioLista, this.semanaMesLista);
      this.confirmationService.confirm({
        message: `Se realizará el registro de los items con precio. ¿Dese continuar con esta acción?`,

        accept: () => {
            //Actual logic to perform a confirmation
            const data:any = {
                fechaLista:this.fechaLista,
                semanaAnioLista:this.semanaAnioLista, 
                semanaMesLista:this.semanaMesLista,
                lista: this.listaItemsMP.filter(item=>item.precioExt !=0)
            }
            this.displayModal= true;
            this.comprasService.grabarListaPreciosMP(this.authService.getToken(),data)
                .subscribe({
                      next:(result)=>{
                          console.log('next',result)
                          /*if(result.status ===200){
                            this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                            
                          }else{
                            this.messageService.add({severity:'error', summary: '!Error', detail: result.err});
                          }
                          this.displayModal= false;*/
                      },
                      error:(err)=>{
                        console.error(err)
                        this.displayModal= false;
                        this.messageService.add({severity:'error', summary: '!Error', detail: err});
                      }
                });
        }
    });
    }
  }

  grabarCambiosParametros(){
    
    let error:boolean = false;
    if(this.parametros.filter(parametro=>parametro.valor === null).length>0){
      this.messageService.add({severity:'error', summary: '!Error', detail: `En la tabla de parametros existen valores en blanco`});
      error = true;
    }

    
    if(!error){
        let data = {
          parametros:this.parametros,
          costos_localidad:[],
          presentacion_items:[]

        }

        this.comprasService.updateParametrosCalculadora(this.authService.getToken(),data)
            .subscribe({
                next:async (result)=>{
                    console.log('result',result)
                    if(!result){
                      this.messageService.add({severity:'success', summary: '!Notificación', detail: `Se ha realizado correctamente la actualización de los parametros`});  
                    }

                    await this.setVariablesParametros();
                },
                error:(err)=>{
                    console.error('err',err);
                    this.messageService.add({severity:'error', summary: '!Error', detail: `Ocurrio un error en la actualización de un parametro:${JSON.stringify(err.error)}`});

                }
            })
    }
  }

  parametrosGlobales(){
    this.formParametrosG= true;
  }

  


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listaItemsMP);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Lista precios MP semana ${this.semanaAnioLista}-${this.fechaLista.getFullYear()}`);
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

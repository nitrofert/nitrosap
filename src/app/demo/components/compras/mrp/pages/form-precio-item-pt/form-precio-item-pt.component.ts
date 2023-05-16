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
  selector: 'app-form-precio-item-pt',
  providers: [MessageService, ConfirmationService],
  templateUrl: './form-precio-item-pt.component.html',
  styleUrls: ['./form-precio-item-pt.component.scss']
})
export class FormPrecioItemPtComponent implements OnInit{

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
  autor:string ="";
  localidad:string ="";
  zonaVenta:string ="";

  listaItemsPT:any[] = [];
  selectedLineItem:any[] = [];
  loading:boolean = false;

  interesDia:number = 120; //Se obtiene de las variables globales
  prcInteres:number = 0.095; //Se obtiene de las variables globales
  precioEntregaPT:number = 15; //Se obtiene de las variables globales

  dependencias:any[] = [];
  zonas:any[] = [];
  selectedZona:any;
  localidades:any[] = [];
  selectedLocalidad:any;
  autores:any[] = []; 
  selectedAutor:any;
  autoresFiltrados:any[]=[];
  editPrecio:boolean = false;

  itemsPTSemana:any[] = [];

  formularioAutor:boolean = false;
  loadingCargueAutor:boolean = false;
  envioAutor:boolean = false;


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
    this.getItems();
    //this.getItemsPTSemana(this.semanaAnioLista);
    this.getDimensiones();
    this.getAutores();
    
  }

  getDimensiones(){
    this.comprasService.getDimensiones(this.authService.getToken())
        .subscribe({
            next:(dimensiones)=>{
                console.log(dimensiones);
                this.dependencias = dimensiones.filter(dimension => dimension.U_NF_DIM3_VICE ==='VPCOCIAL');
                let localidades = [];
                let zonas =[];
                for(let linea of this.dependencias){

                  

                    if(linea.U_NF_DIM2_DEP ==='CCIALSUR' || linea.U_NF_DIM2_DEP ==='CCINORTE'){
                        if(zonas.filter(zona =>zona.code===linea.U_NF_DIM2_DEP).length ===0){
                          zonas.push({ code:linea.U_NF_DIM2_DEP,label:linea.U_NF_DIM2_DEP});
                        }
                    }
                }
                this.zonas = zonas.sort((p1, p2) => (p1.code > p2.code) ? 1 : (p1.code < p2.code) ? -1 : 0);
            },
            error:(err)=>{
              console.error(err);
            }
        });
  }

  getAutores(){
    this.comprasService.getAutores(this.authService.getToken())
    .subscribe({
        next:(autores)=>{
            console.log(autores);
            this.autores = autores
            
        },
        error:(err)=>{
          console.error(err);
        }
    });
  }

  nuevoAutor(){
    this.formularioAutor=true;
    this.autor="";
  }

  filtrarAutores(event:any){
    let filtered : any[] = [];
    let query = event.query;
     ////console.log(this.cuentasDependencia);
  
    for(let i = 0; i < this.autores.length; i++) {
      let autor = this.autores[i];
    
        
        if((autor.autor.toLowerCase().indexOf(query.toLowerCase())>=0)){
          ////console.log(cuentaDependencia);
          filtered.push(autor);
       }
    
    }
    
  
    this.autoresFiltrados = filtered;
  }

  getItems(){
      this.sapService.itemsPTSAPMysql(this.authService.getToken())
 
          .subscribe({
            next: (items) => {
              console.log(items);
              let itemsPT:any[] =[];
              for(let item in items){
             
                itemsPT.push({
                  ItemCode: items[item].ItemCode,
                  ItemName: items[item].ItemName,
                  precio:0
                });
              }

              this.listaItemsPT = itemsPT;
            },
            error: (error) => {
                console.error(error);      
            }
          });
  }

  seleccionarZona(){
    console.log(this.selectedZona);
    this.selectedLocalidad= [];
    if(this.selectedZona){
      let localdadesxzona = this.dependencias.filter(dependencia=>dependencia.U_NF_DIM3_VICE==='VPCOCIAL' && dependencia.U_NF_DIM2_DEP===  this.selectedZona.code);

      console.log(localdadesxzona);
      
      let localidades=[];
      for(let lineaDependencias of localdadesxzona){

        if(lineaDependencias.U_NF_DIM3_VICE ==='VPCOCIAL'){
          if(localidades.filter(localidad =>localidad.code===lineaDependencias.U_NF_DIM1_LOC).length ===0){
            localidades.push({ code:lineaDependencias.U_NF_DIM1_LOC,label:lineaDependencias.U_NF_DIM1_LOC});
          }
        }
      }

      this.localidades = localidades.sort((p1, p2) => (p1.code > p2.code) ? 1 : (p1.code < p2.code) ? -1 : 0);
    
    }

    this.cargarListaPrecios();
    
    /**/
  }

  async cargarListaPrecios(){
    if(this.selectedAutor && this.selectedLocalidad && this.selectedZona){
        this.loading= true;
        console.log(this.selectedAutor , this.selectedLocalidad , this.selectedZona);
        let data = {
          semanaAnioLista:this.semanaAnioLista,
          anio:this.fechaLista.getFullYear(),
          localidad:this.selectedLocalidad.code,
          zona_venta: this.selectedZona.code,
          autor_id:this.selectedAutor.id
        }
        await this.resetListaPT();
        //Buscar precios de los productos termniados segun la semana, año, zona localidad y autor
        this.comprasService.getPreciosPTxSemanaZonaAutor(this.authService.getToken(),data)
            .subscribe({
                next:(itemsPTSemanaZonaAutor)=>{
                    console.log(itemsPTSemanaZonaAutor);
                    for(let item of itemsPTSemanaZonaAutor){
                        if(this.listaItemsPT.filter(itemPt=>itemPt.ItemCode === item.ItemCode).length>0){
                            let indexPt =this.listaItemsPT.findIndex(itemPt=>itemPt.ItemCode === item.ItemCode);
                            this.listaItemsPT[indexPt].precio = item.precio;
                        }
                    }
                    this.loading= false;
                },
                error:(err)=>{
                    console.error(err);
                }
            });

        this.editPrecio = true;
    }else{
      this.editPrecio = false;
    }
  }

 

  async calcularSemana(){
    console.log(this.fechaLista);
    this.semanaAnioLista = await this.numeroDeSemana(new Date(this.fechaLista));
    this.semanaMesLista = await this.semanaDelMes(this.fechaLista);
    this.cargarListaPrecios();
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
      //this.calcularPrecioNT(event.target.value,itemCode);
    }
  }

  cambio(event:any,itemCode:any){
    ////console.log(event.target.value);
    if(event.target.value ===''){
      event.target.value =0;
    }
       //this.calcularPrecioNT(event.target.value,itemCode);
  }

  calcularPrecioNT(precio:any, itemCode:any){
    
    let interesPT = 0;
    let precioPTNT = 0;
    
    if(precio!=0){
      interesPT = parseFloat(precio)*((this.interesDia/365)*this.prcInteres);
      precioPTNT = parseFloat(precio) + this.precioEntregaPT + interesPT;
    }

    let indexItemsPT = this.listaItemsPT.findIndex(item => item.ItemCode == itemCode);
    this.listaItemsPT[indexItemsPT].precioNac = precioPTNT;

    //console.log(precioPTNT);
  }

  
  grabarListaPreciosPT(){
   
    if( this.listaItemsPT.filter(item=>item.precio !=0).length===0){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe ingresar por lo menos el precio de un item'});
    }else{
      console.log(this.fechaLista,this.semanaAnioLista, this.semanaMesLista);
      this.confirmationService.confirm({
        message: `Se realizará el registro de los items con precio. ¿Dese continuar con esta acción?`,

        accept:  () => {
            //Actual logic to perform a confirmation
            const data:any = {
                fechaLista:this.fechaLista,
                semanaAnioLista:this.semanaAnioLista, 
                semanaMesLista:this.semanaMesLista,
                zona_venta:this.selectedZona.code,
                localidad:this.selectedLocalidad.code,
                autor_id: this.selectedAutor.id,
                lista: this.listaItemsPT.filter(item=>item.precio !=0)
            }

            this.displayModal= true;
            
            this.comprasService.grabarListaPreciosPT(this.authService.getToken(),data)
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

  async resetListaPT(){
    for(let item of this.listaItemsPT){
        item.precio=0;
    }
  }

  crearAutor(){
    this.envioAutor =true;
    if(this.autor==="" || !this.autor){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe el nombre del autor'});
    }else{
        this.comprasService.nuevoAutor(this.authService.getToken(),{autor:this.autor})
            .subscribe({
                next:(result)=>{
                    if(result.error) {
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }else{
                      this.messageService.add({severity:'success', summary: '!Notificacion', detail: result.message});
                      this.envioAutor =false;
                      this.formularioAutor = false;
                      this.getAutores();
                    }
                   
                },
                error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'error', summary: '!Error', detail: err});
                } 
            });
    }
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.listaItemsPT);
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

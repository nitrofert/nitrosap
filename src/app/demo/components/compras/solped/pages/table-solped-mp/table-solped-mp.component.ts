import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { SolpedInterface } from 'src/app/demo/api/solped';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-table-solped-mp',
  providers: [MessageService, ConfirmationService],
  templateUrl: './table-solped-mp.component.html',
  styleUrls: ['./table-solped-mp.component.scss']
})
export class TableSolpedMPComponent implements OnInit, OnChanges {

  @Input() documentList!:any;
  @Input() color!:any;
  @Input() showNuevo!:any;
  @Input() showEditar!:any;
  @Input() showEnvioSAP!:any;
  @Input() showDeleteSolped!:any;
  @Input() titulo!:any;
  @Input() nombreLista!:any;
  @Input() loading!:boolean;

  @Input() documento!:any;

  @Output() onChangeTabla: EventEmitter<any> = new EventEmitter();
  @Output() onChangeLoading: EventEmitter<any> = new EventEmitter();


  

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];



 
  
  //loading:boolean = true;
  selectedItem:any[] = [];


  formulario:boolean = false;
  envioFormulario:boolean = false;

  //estados:any[] = [{name:'Por cargar'},{name:'Cargado'},{name:'Documentación lista'},{name:'Descargado'}];
  estados:any[] = [{name:'Por cargar'},{name:'Cargado'},{name:'Pedidos en puerto'}];
  u_nf_status:string= "";

  u_nf_lastshippping!:any;
  u_nf_dateofshipping!:any;
  RequriedDate!:any;
  cantidad!:any;
  cantidadkl!:any;
  comentarios:any;
  nf_tipocarga:string="";
  agentes:any[] = [{tipo:'Multiport'},{tipo:'Pharo'},{tipo:'Deep Blue'},{tipo:'SCS'},{tipo:'TRANSMARES'}];
  nf_agente:string="";
  nf_motonave:string="";
  nf_puertosalida:string ="";
  nf_pago:string ="";
  nf_Incoterms:string ="";
  tipo_Incoterms:any[] = [{tipo:'CIF'},{tipo:'CFR'},{tipo:'FCA'},{tipo:'FOB'}];
  loadingSave:boolean = false;
  tiposdecarga:any[] = [{tipo:'Empacado'},{tipo:'Granel'}];
  tituloFormEditPedido:string = "";

  statuses:any[] = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
  approves:any[] = [{label:'No aprobada',value:'No'},{label:'Aprobada',value:'A'},{label:'Pendiente',value:'P'},{label:'Rechazada',value:'R'}];


  errorSolpedEnviada:boolean = false;
  arrayErrorSolpedEnviada:any[] = [];

  errorSolpedCancelada:boolean = false;
  arrayErrorSolpedCancelada:any[] = [];

  errorSopledARechazada:boolean = false;
  arraySolpedRechazadas:any[]  =[];

  arrayIdSolped:any[]=[];
 
  arraryErrorTrm:any[] = [];

  errorModal:any;


  @ViewChild('filter') filter!: ElementRef;
 
  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private authService: AuthService,
    private sapService: SAPService) { }

  ngOnInit(): void {

    this.infoUsuario = this.authService.getInfoUsuario();
    //console.log(this.infoUsuario);
     
     //console.log(this.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     //console.log(this.router.url);
     //console.log(this.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     //console.log('Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);

     //console.log(this.solpedList);
    //this.getSolpedList();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes['solpedList'].currentValue);
    if(changes['documentList'].currentValue.length>0){
      this.getSolpedList();
    }else{
      setTimeout(()=>{this.getSolpedList();},5000)
    }
  }
  

  getSolpedList(){
    //this.solpedList = this.solpedListestado;

    this.loading = false;
    
    //this.onChangeLoading.emit({lista:this.nombreLista,estado:false});
    //console.log(this.solpedList);
  }
 

  newSolped(){

    this.router.navigate(['/portal/compras/solped/nueva-mp']);
  }

  editSolped(){
    //console.log(this.selectedSolped); 
    /*this.formulario = true;
    this.asignarCampos();*/
    if(this.documento=='Solped' || this.documento=='Proyecciones'){
      this.router.navigate(['/portal/compras/solped/editar-mp',this.selectedItem[0].id]);
    }

    if(this.documento=='Pedido'){
        this.formulario= true;
        this.loadingSave = false;
        this.asignarCampos();
    }

    if(this.documento=='Entrada'){

    }
    
  }

  asignarCampos(){ 
    console.log(this.selectedItem[0]);
    let hora = 60 * 60000;
    this.tituloFormEditPedido = 'Editar pedido '+this.selectedItem[0].DocNum;
    
    //this.u_nf_status = this.estados.filter(estado=>estado.name.toLowerCase() === this.selectedItem[0].U_NF_STATUS.toLowerCase())[0].name;
    this.u_nf_status=this.selectedItem[0].U_NF_STATUS=='Solicitado'?'Por cargar':this.selectedItem[0].U_NF_STATUS;
    console.log(this.u_nf_status);
    this.u_nf_lastshippping = new Date (new Date(this.selectedItem[0].U_NF_LASTSHIPPPING).getTime()+(hora*5));
    this.u_nf_dateofshipping = new Date(new Date(this.selectedItem[0].U_NF_DATEOFSHIPPING).getTime()+(hora*5));
    this.RequriedDate = new Date(new Date(this.selectedItem[0].RequriedDate).getTime()+(hora*5));
    this.cantidad = this.selectedItem[0].Quantity;
    this.cantidadkl = this.selectedItem[0].Quantity*1000;
    this.comentarios = this.selectedItem[0].Comments;
    this.nf_tipocarga = this.selectedItem[0].U_NF_TIPOCARGA;
    this.nf_agente = this.selectedItem[0].U_NF_AGENTE;
    this.nf_motonave  = this.selectedItem[0].U_NF_MOTONAVE;
    this.nf_puertosalida = this.selectedItem[0].U_NF_PUERTOSALIDA;
    this.nf_pago = this.selectedItem[0].U_NF_PAGO;
    this.nf_Incoterms = this.selectedItem[0].U_NT_Incoterms;

  }

  calcularCantidadKL(){}

  ActualizarPedido(){

    this.envioFormulario = true;

    if(this.u_nf_status!='' && this.u_nf_dateofshipping!='' && this.u_nf_lastshippping!='' && this.RequriedDate!=''){

      this.loadingSave= true;

      let infoPedidoUpdate:any = {
        DocEntry:this.selectedItem[0].DocEntry,
        DocNum:this.selectedItem[0].DocNum,
        pedidoData:{
            
            
            U_NF_STATUS:this.u_nf_status=='Por cargar'?'Solicitado':this.u_nf_status,
            U_NF_LASTSHIPPPING:this.u_nf_lastshippping,
            U_NF_DATEOFSHIPPING:this.u_nf_dateofshipping,
            DocDueDate:this.RequriedDate,
            Comments:this.comentarios,
            U_NF_TIPOCARGA:this.nf_tipocarga,
            U_NF_PAGO:this.nf_pago,
            U_NF_AGENTE:this.nf_agente,
            U_NF_MOTONAVE:this.nf_motonave,
            U_NF_PUERTOSALIDA:this.nf_puertosalida,
            U_NT_Incoterms:this.nf_Incoterms
            
        }
        
      }
      console.log(infoPedidoUpdate);
  
      this.comprasService.actualizarPedidoSAP(this.authService.getToken(),infoPedidoUpdate)
          .subscribe({
              next: (result)=>{
                console.log(result);
                this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                this.onChangeTabla.emit(this.nombreLista);
                this.selectedItem=[];
                this.loading = true;
                //this.onChangeLoading.emit({lista:this.nombreLista,estado:true});
                this.formulario = false;
              },
              error: (err)=>{
                console.log(err);
                this.messageService.add({severity:'error', summary: '!Error', detail: err});
              }
          });
    }else{
      this.messageService.add({severity:'error', summary: '!Error', detail:'Debe diligenciar los campos resaltados en rojo'});
    }

  }

  envairSAP(){
      //console.log('Envio a SAP',this.selectedSolped);
      this.loading = true;
      //this.onChangeLoading.emit({lista:this.nombreLista,estado:true});
      if(this.selectedItem[0].approved=='N'){
        this.comprasService.enviarSolpedSAP(this.authService.getToken(),{id:this.selectedItem[0].id})
            .subscribe({
                next:(result)=>{
                    //console.log(result);
                    this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                    this.loading = false;
                    this.onChangeTabla.emit(this.nombreLista);

                    //this.onChangeLoading.emit({lista:this.nombreLista,estado:false});
                },
                error:(err)=>{
                  console.log(err);
                  this.loading = false;
                  //this.onChangeLoading.emit({lista:this.nombreLista,estado:false});
                }
            });
      }else if(this.selectedItem[0].approved=='C'){
        this.messageService.add({severity:'error', summary: '!Error', detail: 'La solped seleccionada fue ya fue cancelada.'});
        this.loading = false;
      }else if(this.selectedItem[0].approved=='A'){
        this.messageService.add({severity:'error', summary: '!Error', detail: 'La solped seleccionada fue ya fue enviada a SAP.'});
        this.loading = false;
        //this.onChangeLoading.emit({lista:this.nombreLista,estado:false});
      }
      
  }

  cancelarSolped(){

    let arrayIdSolped:number[] = [];
      let fechaActual: Date = new Date();
      
      this.errorSolpedCancelada = false;
      this.arrayErrorSolpedCancelada =[];
     
      this.errorSolpedEnviada = false;
      this.arrayErrorSolpedEnviada = []; 
  
      console.log(this.selectedItem);
  
      for(let item of this.selectedItem){
  
        if(item.approved==='C'){
          this.errorSolpedCancelada = true;
          this.arrayErrorSolpedCancelada.push(item.id);
        }  
        
        
  
        
  
        arrayIdSolped.push(item.id);
    }
  
    this.arrayIdSolped = arrayIdSolped;
    let message = "";
    if(this.errorSolpedCancelada){
      //Mostrar dialog de error de TRM en solicitud o solicitudes seleccionada
      if(this.arrayErrorSolpedCancelada.length > 1){
  
          message = `Los documentos ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya han sido canceladaos.`;
      }else{
        message = `El documento ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya ha sido cancelado`;
      }
  
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSolpedCancelada = false;
    }else{
  
      
        
          if(arrayIdSolped.length >1){
            message =`¿Desea Continuar con la cancelación de los documentos seleccionados?`;
          }else{
            message = `¿Desea Continuar con la cancelación del  documento seleccionado?`;
          }
        
  
        this.messageService.clear();
        this.messageService.add({key: 'cdel', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
      
    }
  
  }

  onRejectCancel(){
    this.messageService.clear('cdel');
    //console.log(this.arrayIdSolped);
  }
  
  onConfirmCancel(){
    this.loading = true;
    let message = "";
    this.messageService.clear('cdel');
    this.comprasService.cancelacionSolped(this.authService.getToken(), this.arrayIdSolped)
        .subscribe({
          next:(solpedCanceladas)=>{
            if(solpedCanceladas.status=="ok"){
              if(this.arrayIdSolped.length >1){
                message =`La cancelación de los documentos seleccionados fueron realizados correctamente`;
              }else{
                message = `La cancelación del documento seleccionado fue realizado correctamente`;
              }
              this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});
              this.onChangeTabla.emit(this.nombreLista);
              //this.getListado();
            }else{
              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: solpedCanceladas.message});
              this.loading = false;
            }
          },
          error:(err)=>{
            console.log(err);
            this.loading = false
            this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
          }
        });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.documentList);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `${this.documento}`);
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

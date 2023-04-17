import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, ConfirmEventType, MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { SAPService } from 'src/app/demo/service/sap.service';
import { SolpedDet } from 'src/app/demo/api/solped';
import * as FileSaver from 'file-saver';
//import * as download   from 'downloadjs'




interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-solped',
  providers: [MessageService, ConfirmationService],
  templateUrl: './solped.component.html',
  styleUrls: ['./solped.component.scss'],
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
export class SolpedComponent implements OnInit {

  solped:any[] = [];
  loading: boolean = true;
  statuses!:any[];
  approves!:any[];
  errorFechaAprobacion:boolean = false;
  arrayErrorFecha:any[]=[];
  errorTrmAprobacion:boolean = false;
  arrayIdSolped:any[] = [];
  infoUsuario!:InfoUsuario;

  frmRechazo:boolean = false;
  motivoRechazo:string = "";
  submitRechazo:boolean = false;

  errorUsuarioAprobador:boolean = false;
  arrayErrorUsuarioAprobador:any[] = [];
  errorSopledAprobada:boolean = false;
  arraySolpedAprobadas:any[] = [];

  errorSolpedEnviada:boolean = false;
  arrayErrorSolpedEnviada:any[] = [];

  errorSolpedCancelada:boolean = false;
  arrayErrorSolpedCancelada:any[] = [];

  errorSopledARechazada:boolean = false;
  arraySolpedRechazadas:any[]  =[];
 
  arraryErrorTrm:any[] = [];

  errorModal:any;

  selectedSolped:any[] = [];

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  dialogAprobaciones:boolean = false;

  listaAprobaciones!:any[];
  loadingAp:boolean = true;

  urlBreadCrumb:string ="";

  dialogAdjuntos:boolean = false;

  series:any[] = [];

  listaDocumentosSolped:any[] = [];
  loadingDocumentos:boolean = true;

  displayModal:boolean = false;
  loadingCargue:boolean = false;

  @ViewChild('filter') filter!: ElementRef;


  lineasSolped:SolpedDet[] = [];
  lineaSeleccionada:SolpedDet[] = [];
  listadoLineas:boolean = false;

  

  totalimpuestos:number = 0;
  subtotal:number = 0;
  grantotal:number =0;

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              private sapService:SAPService,
              private comprasService:ComprasService,
              private router:Router,
              private confirmationService: ConfirmationService, 
              private messageService: MessageService,
              private authService: AuthService) { }
              

  ngOnInit(): void {
    
     //obtener datos del usuario logueado
    this.infoUsuario = this.authService.getInfoUsuario();
     
     //////console.logthis.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     //////console.logthis.router.url);
     //////console.logthis.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     //////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.urlBreadCrumb = this.router.url;

     this.statuses = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
     this.approves = [{label:'No enviada',value:'N'},{label:'Aprobada',value:'A'},{label:'Pendiente',value:'P'},{label:'Rechazada',value:'R'}];


   //this.getSeries();
    this.getListado();
    
  }

  getListado(){
    this.comprasService.listSolped(this.authService.getToken())
    .subscribe({
      next:(solped =>{
          ////console.logsolped);
          this.loading = false;
          this.solped = solped;
          this.loading = false;
      }),
      error:(err =>{
        console.error(err);
      })
    });
  }


  newSolped(){
    
    this.router.navigate(['/portal/compras/solped/nueva']);
  }

  editSolped(){
    
    this.router.navigate(['/portal/compras/solped/editar',this.selectedSolped[0].id]);
  }

  confirm() {
    
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
        },
        reject: (type: any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                break;
            }
        }
    });
  }

mostrarAprobaciones(idSolped:any){
  this.dialogAprobaciones = true;
  
  this.comprasService.aprobacionesSolped(this.authService.getToken(),idSolped)
      .subscribe({
        next:(aprobaciones)=>{
            //////console.logaprobaciones);
            this.listaAprobaciones = aprobaciones;
            this.loadingAp = false;
        },
        error:(err)=>{
            ////console.logerr);
        }

      });
}

mostrarAadjuntos(idSolped:any){
  this.dialogAdjuntos = true;

  this.comprasService.solpedById(this.authService.getToken(),idSolped)
  .subscribe({
    next:(infoSolped)=>{
       ////console.loginfoSolped.anexos);
       this.listaDocumentosSolped = infoSolped.anexos;
       this.loadingDocumentos=false;
    },
    error:(err)=>{
        ////console.logerr);
    }

  });
}

  async downloadAnexo(idArchivo:number,idSolped:number){
  let file = this.listaDocumentosSolped.filter(item=>item.id === idArchivo)[0];

  this.comprasService.getAnexoSolped(this.authService.getToken(),idArchivo,idSolped)
      .subscribe({
        next:async (anexo)=>{
            if(anexo.data!==''){
                //////console.loganexo.data);
                /** Work */
                //const blobPDF = await this.base64toBlob(anexo.data, 'application/pdf');
                //download(new Blob([blobPDF]), 'filename.pdf', 'application/pdf');

                const source = `data:application/pdf;base64,${anexo.data}`;
                const link = document.createElement("a");
                link.href = source;
                link.download = `${file.nombre}`
                link.click()

            }else{
              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail:"No existe documento cargado en la base de datos"});
            }
        },
        error:(err)=>{
          ////console.logerr);
        }
      });
  
  //if(file !==null){
    //////console.logfile.toString('base64'));

    /*
    let newfile = new Blob([file.data], { type: 'application/pdf' });            
    var fileURL = URL.createObjectURL(newfile);
    window.open(fileURL);*/

    /*const source = `data:application/pdf;base64,${file.data}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `export.pdf`
    link.click();*/

    /*const url = window.URL.createObjectURL(new Blob([file.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'yourcoolpdf.pdf');
    //document.body.appendChild(link);
    link.click();*/

    //const blobPDF = await this.base64toBlob(file.toString('base64'), 'application/pdf');

    //download(new Blob([blobPDF]), 'filename.pdf', 'application/pdf');
    //download(new Blob([file]), 'filename.pdf', 'application/pdf');

  /*}else{
    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail:"No existe documento cargado en la base de datos"});
  }*/
}

async base64toBlob(base64Data:any, contentType = '') {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; sliceIndex += 1) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; i += 1, offset += 1) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }

    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }

  return new Blob(byteArrays, { type: contentType });
}

cancelarSolped(){

  let arrayIdSolped:number[] = [];
    let fechaActual: Date = new Date();
    
    this.errorSolpedCancelada = false;
    this.arrayErrorSolpedCancelada =[];
   
    this.errorSolpedEnviada = false;
    this.arrayErrorSolpedEnviada = []; 

    this.errorSopledAprobada = false;
    this.arraySolpedAprobadas = [];

    for(let item of this.selectedSolped){

      if(item.approved==='C'){
        this.errorSolpedCancelada = true;
        this.arrayErrorSolpedCancelada.push(item.id);
      }  
      
      if(item.approved==='P'){
        this.errorSolpedEnviada = true;
        this.arrayErrorSolpedEnviada.push(item.id);
      }

      if(item.approved==='A'){
        this.errorSopledAprobada = true;
        this.arraySolpedAprobadas.push(item.id);
      }

      arrayIdSolped.push(item.id);
  }

  this.arrayIdSolped = arrayIdSolped;
  let message = "";
  if(this.errorSolpedCancelada){
    //Mostrar dialog de error de TRM en solicitud o solicitudes seleccionada
    if(this.arrayErrorSolpedCancelada.length > 1){

        message = `Las solicitudes ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya han sido canceladas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya ha sido cancelada`;
    }

    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSolpedCancelada = false;
  }else /*if(this.errorSopledAprobada){
    //Mostrar dialog de error de TRM en solicitud o solicitudes seleccionada
    if(this.arraySolpedAprobadas.length > 1){

        message = `Las solicitudes ${JSON.stringify(this.arraySolpedAprobadas)} ya han sido aprobadas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arraySolpedAprobadas)} ya ha sido aprobada`;
    }

    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSopledAprobada = false;
  }else */if(this.errorSolpedEnviada){
    //Mostrar dialog de error de TRM en solicitud o solicitudes seleccionada
    if(this.arrayErrorSolpedEnviada.length > 1){
        message = `Las solicitudes ${JSON.stringify(this.arrayErrorSolpedEnviada)} ya han sido enviadas a aprobación.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arrayErrorSolpedEnviada)} ya ha sido enviada a aprobación`;
    }

    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSolpedEnviada = false;
  }else{

    
      
        if(arrayIdSolped.length >1){
          message =`¿Desea Continuar con la cancelación de las solicitudes seleccionadas?`;
        }else{
          message = `¿Desea Continuar con la cancelación de la solicitud seleccionada?`;
        }
      

      this.messageService.clear();
      this.messageService.add({key: 'cdel', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
    
  }

}

  solicitudAprobacion(){
    //console.logthis.selectedSolped);
   

    let arrayIdSolped:number[] = [];
    let fechaActual: Date = new Date();
    let fechaContSolped:Date;
    this.errorFechaAprobacion = false;
    this.arrayErrorFecha =[];

    this.errorSolpedCancelada = false;
    this.arrayErrorSolpedCancelada =[];

    this.errorTrmAprobacion = false;
    this.arraryErrorTrm = [];

    this.errorSolpedEnviada = false;
    this.arrayErrorSolpedEnviada = []; 

    this.errorSopledAprobada = false;
    this.arraySolpedAprobadas = [];
    for(let item of this.selectedSolped){
        //////console.logitem);
        fechaContSolped = new Date(item.docdate);

        if(item.approved==='C'){
          this.errorSolpedCancelada = true;
          this.arrayErrorSolpedCancelada.push(item.id);
        }  
        
        if(fechaContSolped.toDateString()!==fechaActual.toDateString()){
          this.errorFechaAprobacion = true;
          this.arrayErrorFecha.push(item.id);
        }
        if(item.approved==='P'){
          this.errorSolpedEnviada = true;
          this.arrayErrorSolpedEnviada.push(item.id);
        }

        if(item.approved==='A'){
          this.errorSopledAprobada = true;
          this.arraySolpedAprobadas.push(item.id);
        }

        if(item.trm ===0){
          this.errorTrmAprobacion = true;
          this.arraryErrorTrm.push(item.id);
        }
        arrayIdSolped.push(item.id);
    }
    //////console.logarrayIdSolped);
    this.arrayIdSolped = arrayIdSolped;
    let message = "";
    if(this.errorSolpedCancelada){
      
      if(this.arrayErrorSolpedCancelada.length > 1){
  
          message = `Las solicitudes ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya han sido canceladas.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya ha sido cancelada`;
      }
  
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSolpedCancelada = false;
    }else if(this.errorTrmAprobacion){
      
      if(this.arraryErrorTrm.length > 1){
          message = `Las solicitudes ${JSON.stringify(this.arraryErrorTrm)} no poseen TRM, por favor acutalice la TRM en las sulicitudes`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arraryErrorTrm)} no posee TRM, por favor acutalice la TRM de la sulicitud`;
      }

      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorTrmAprobacion = false;
    }else if(this.errorSopledAprobada){
      
      if(this.arraySolpedAprobadas.length > 1){

          message = `Las solicitudes ${JSON.stringify(this.arraySolpedAprobadas)} ya han sido aprobadas.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arraySolpedAprobadas)} ya ha fue aprobada`;
      }

      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSopledAprobada = false;
    }else if(this.errorSolpedEnviada){
      
      if(this.arrayErrorSolpedEnviada.length > 1){
          message = `Las solicitudes ${JSON.stringify(this.arrayErrorSolpedEnviada)} ya han sido enviadas a aprobación.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arrayErrorSolpedEnviada)} ya ha fue enviada a aprobación`;
      }

      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSolpedEnviada = false;
    }else{

      
        //Verificar si la fecha de la o las solicitudes seleccionadas, corresponden a la fecha actual
        if(this.errorFechaAprobacion){
          if(this.arrayErrorFecha.length >1){
            message = `Las solicitudes ${JSON.stringify(this.arrayErrorFecha)} tienen fechas de contabilización diferentes a la fecha actual. 
                       Recuerde que la TRM de la aprobación sera basada en la fecha de contabilización de la solicitud.
                       ¿Desea Continuar con la aprobación de las solicitudes seleccionadas? `;
          }else{
            message = `La fecha de contabilización de la solicitud ${JSON.stringify(this.arrayErrorFecha)}  es diferente a la fecha actual. 
            Recuerde que la TRM de la aprobación sera basada en la fecha de contabilización de la solicitud.
            ¿Desea Continuar con la aprobación de la solicitud seleccionada? `;
          }
        }else{
          if(arrayIdSolped.length >1){
            message =`¿Desea Continuar con la aprobación de las solicitudes seleccionadas?`;
          }else{
            message = `¿Desea Continuar con la aprobación de la solicitud seleccionada?`;
          }
        }

        this.messageService.clear();
        this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
      
    }

   

  }

  onConfirm() {
    this.loadingCargue = true;
    this.displayModal= true;
    this.loading = true;
    let message = "";
    this.messageService.clear('c');
    this.comprasService.envioAprobacionSolped(this.authService.getToken(), this.arrayIdSolped)
        .subscribe({
          next: (aprobaciones) => {
            //console.logaprobaciones);
            /*this.loadingCargue = false;
            this.displayModal= false;
            if(aprobaciones.filter((item:any)=> item.status==='error').length === 0) {

              if(this.selectedSolped.length>1){
                message = "Las solicitudes seleccionadas, han sido enviadas a aprobación";
              }else{
                message = "Las solicitud seleccionada, ha sido enviada a aprobación";
              }
              this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});
              this.getListado();
            }else{
              this.loading = false;
              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: aprobaciones[0].message});
            }*/
            this.loadingCargue = false;
            this.displayModal= false;
            let messageServiceTmp:any[] = [];
            let severity:string ="";
            
            if(aprobaciones[0].status=='error'){
              this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: aprobaciones[0].message});
            }

            if(aprobaciones[0].status=='complete'){
              
              if(aprobaciones[0].arrayErrors.length >0 && aprobaciones[0].arrayAproved.length >0){
                severity="warn";
              }else if(aprobaciones[0].arrayErrors.length >0 && aprobaciones[0].arrayAproved.length ==0){
                severity="error";
              }else if(aprobaciones[0].arrayErrors.length ==0 && aprobaciones[0].arrayAproved.length >0){
                severity="success";
              }
              this.messageService.add({key: 'tl',severity, summary: '!información', detail: aprobaciones[0].message});
            }

            for(let item of aprobaciones[0].arrayErrors){
              messageServiceTmp.push({key: 'tl',severity:'error', summary: '!Error', detail: item.message,life:5000});
            }

            for(let item of aprobaciones[0].arrayAproved){
              messageServiceTmp.push({key: 'tl',severity:'success', summary: '!Notificación¡', detail: item.message,life:5000});
            }

            this.getListado();
            this.messageService.addAll(messageServiceTmp);
            this.selectedSolped=[]

          },
          error: (err) => {
            ////console.logerr);
            this.loading = false;
            this.loadingCargue = false;
            this.displayModal= false;
            this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
          }
        });
}

rechazar(){
  //////console.log'Rechazar solcitud');
  this.arrayIdSolped = [];
  let arrayIdSolped:number[] = [];
  this.arraySolpedRechazadas = [];
  this.arraySolpedAprobadas = [];
  this.arrayErrorUsuarioAprobador =[];
  this.errorSopledARechazada = false;
  this.errorSopledAprobada = false;
  this.errorUsuarioAprobador = false;

  for(let item of this.selectedSolped){
      //////console.logitem);
    
      if(item.approved==='R'){
        this.errorSopledARechazada = true;
        this.arraySolpedRechazadas.push(item.id);
      }

      
      
      if(item.approved==='A'){
        this.errorSopledAprobada = true;
        this.arraySolpedAprobadas.push(item.id);
      }
      
      if(item.usersapaprobador.toLowerCase() !== this.infoUsuario.codusersap.toLowerCase()){
       
        this.errorUsuarioAprobador = true;
        this.arrayErrorUsuarioAprobador.push(item.id);
      }
      arrayIdSolped.push(item.id);
  }

  //////console.logarrayIdSolped);
  this.arrayIdSolped = arrayIdSolped;
  let message = "";

  //////console.log'Rechazada',this.errorSopledARechazada,'Aprobada',this.errorSopledAprobada,'Usuario',this.errorUsuarioAprobador);

  if(this.errorSopledARechazada){
    if(this.arraySolpedRechazadas.length>1){
      message = `Las solicitudes ${JSON.stringify(this.arraySolpedRechazadas)} ya fueron rechazadas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arraySolpedRechazadas)} ya fue rechazada.`;
    }
    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSopledARechazada= false;
  }else if(this.errorSopledAprobada){
      if(this.arraySolpedAprobadas.length>1){
        message = `Las solicitudes ${JSON.stringify(this.arraySolpedAprobadas)} ya han sido aprobadas.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arraySolpedAprobadas)} ya ha sido aprobada.`;
      }
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSopledAprobada= false;
  }else if(this.errorUsuarioAprobador){
      if(this.arrayErrorUsuarioAprobador.length>1){
        message = `Las solicitudes ${JSON.stringify(this.arrayErrorUsuarioAprobador)} no pueden ser rechazadas por el usuario por ahora.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arrayErrorUsuarioAprobador)} no puede ser rechazada por el usuario por ahora.`;
      }
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorUsuarioAprobador = false;
  }else{
    //////console.log"Aprobar");
    if(arrayIdSolped.length >1){
      message =`¿Desea Continuar con el rechazo de las solicitudes seleccionadas?`;
    }else{
      message = `¿Desea Continuar con el rechazo de la solicitud seleccionada?`;
    }
    this.messageService.clear();
    this.messageService.add({key: 'rj', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
  }

}

aprobar(){
  //////console.log'Aprobar solcitudes');
  
  this.arrayIdSolped = [];
  let arrayIdSolped:number[] = [];
  this.arraySolpedRechazadas = [];
  this.arraySolpedAprobadas = [];
  this.arrayErrorUsuarioAprobador =[];
  this.errorSopledARechazada = false;
  this.errorSopledAprobada = false;
  this.errorUsuarioAprobador = false;
  this.errorSolpedCancelada = false;
  this.arrayErrorSolpedCancelada =[];
  for(let item of this.selectedSolped){
      //////console.logitem);
    
      if(item.approved==='R'){
        this.errorSopledARechazada = true;
        this.arraySolpedRechazadas.push(item.id);
      }

      if(item.approved==='C'){
        this.errorSolpedCancelada = true;
        this.arrayErrorSolpedCancelada.push(item.id);
      }  
      
      if(item.approved==='A'){
        this.errorSopledAprobada = true;
        this.arraySolpedAprobadas.push(item.id);
      }

      if(item.usersapaprobador.toLowerCase() !== this.infoUsuario.codusersap.toLowerCase()){
        this.errorUsuarioAprobador = true;
        this.arrayErrorUsuarioAprobador.push(item.id);
      }
      arrayIdSolped.push(item.id);
  }

  //////console.logarrayIdSolped);
  this.arrayIdSolped = arrayIdSolped;
  let message = "";

  if(this.errorSolpedCancelada){
      
    if(this.arrayErrorSolpedCancelada.length > 1){

        message = `Las solicitudes ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya han sido canceladas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arrayErrorSolpedCancelada)} ya ha sido cancelada`;
    }

    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSolpedCancelada = false;

  }else if(this.errorSopledARechazada){
    if(this.arraySolpedRechazadas.length>1){
      message = `Las solicitudes ${JSON.stringify(this.arraySolpedRechazadas)} ya fueron rechazadas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arraySolpedRechazadas)} ya fue rechazada.`;
    }
    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSopledARechazada= false;
   
  }else if(this.errorSopledAprobada){
      if(this.arraySolpedAprobadas.length>1){
        message = `Las solicitudes ${JSON.stringify(this.arraySolpedAprobadas)} ya han sido aprobadas.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arraySolpedAprobadas)} ya ha sido aprobada.`;
      }
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorSopledAprobada= false;
     
  }else if(this.errorUsuarioAprobador){
      if(this.arrayErrorUsuarioAprobador.length>1){
        message = `Las solicitudes ${JSON.stringify(this.arrayErrorUsuarioAprobador)} no pueden ser aprobadas por el usuario por ahora.`;
      }else{
        message = `La solicitud ${JSON.stringify(this.arrayErrorUsuarioAprobador)} no puede ser aprobada por el usuario por ahora.`;
      }
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
      this.errorUsuarioAprobador = false;
   
  }else{
    //////console.log"Aprobar");
    if(arrayIdSolped.length >1){
      message =`¿Desea Continuar con la aprobación de las solicitudes seleccionadas?`;
    }else{
      message = `¿Desea Continuar con la aprobación de la solicitud seleccionada?`;
    }
    this.messageService.clear();
    this.messageService.add({key: 'ap', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
  }



}

duplicar(){

  //console.logthis.selectedSolped);
  
  this.confirmationService.confirm({
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    message: `Esta usted seguro de dulpicar la solped número ${this.selectedSolped[0].id}?`,
    accept: () => {
        //Actual logic to perform a confirmation
        this.displayModal= true;
        this.loadingCargue= true;
        this.router.navigate(['/portal/compras/solped/nueva',this.selectedSolped[0].id]);
        
        
    }
});

}

onReject() {
    this.messageService.clear('c');
    this.errorFechaAprobacion = false;
    //////console.logthis.arrayIdSolped);
}

onRejectAp() {
  this.messageService.clear('ap');
  ////console.logthis.arrayIdSolped);
}

onRejectRap(){
  this.messageService.clear('rj');
  //////console.logthis.arrayIdSolped);
}

onRejectCancel(){
  this.messageService.clear('cdel');
  //////console.logthis.arrayIdSolped);
}

onConfirmCancel(){
  this.loadingCargue = true;
  this.displayModal= true;
  this.loading = true;
  let message = "";
  this.messageService.clear('cdel');
  this.comprasService.cancelacionSolped(this.authService.getToken(), this.arrayIdSolped)
      .subscribe({
        next:(solpedCanceladas)=>{
          this.loadingCargue = false;
          this.displayModal= false;
          if(solpedCanceladas.status=="ok"){
            if(this.arrayIdSolped.length >1){
              message =`La cancelación de las solicitudes seleccionadas fueron realizadas correctamente`;
            }else{
              message = `La cancelación de la solicitud seleccionada fue realizada correctamente`;
            }
            this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});
            this.getListado();
          }else{
            this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: solpedCanceladas.message});
            this.loading = false;
          }
        },
        error:(err)=>{
          ////console.logerr);
          this.loading = false
          this.loadingCargue = false;
          this.displayModal= false;
          this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
        }
      });
}

onConfirmRap(){
  //Llamar al form de rechazo
  this.messageService.clear('rj');
  this.frmRechazo = true;
  
}

rechazarSolped(){
    this.loadingCargue = true;
    this.displayModal= true;
    this.submitRechazo = true;
    
    if(!this.motivoRechazo){
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: 'Debe diligenciar el motivo por el cual desea rechazar la solicitud seleccionada'});
    }else{
      //Obtener aprobaciones de la solped seleccionada
      this.comprasService.aprobacionesSolped(this.authService.getToken(),this.selectedSolped[0].id)
          .subscribe({
            next: (aprobaciones)=>{

                //////console.logaprobaciones);
                //Filtrar el array de aprobaciones asociados a la solped seleccionada donde el aprobador, estadoap y estadoseccion de la liena === al usuario aprobador, estadoseccion activo y estado de aprobacion line a en P
                let lineaAprobacionUsuario = aprobaciones.filter(item => item.usersapaprobador === this.infoUsuario.codusersap && item.estadoseccion==='A' && item.estadoap==='P');
                //////console.loglineaAprobacionUsuario);
                //Rechazar la solped y enviar notificación
                let infoSolped:any = {
                    autor: {
                        fullname: lineaAprobacionUsuario[0].nombreautor,
                        email: lineaAprobacionUsuario[0].emailautor,
                    },
                    aprobador: {
                        fullname: lineaAprobacionUsuario[0].nombreaprobador,
                        email: lineaAprobacionUsuario[0].emailaprobador,
                        usersap: lineaAprobacionUsuario[0].usersapaprobador,
    
                    },
                    infoSolped: {
                        id_solped: this.selectedSolped[0].id,
                        idlineap: lineaAprobacionUsuario[0].id,
                        bdmysql:this.infoUsuario.bdmysql,
                        companysap:this.infoUsuario.dbcompanysap,
                        logo:this.infoUsuario.logoempresa,
                        comments:this.motivoRechazo
                    }
                }

                this.comprasService.rechazoSolped(infoSolped)
                    .subscribe({
                        next: (result)=>{
                            //////console.logresult);
                            this.loadingCargue = false;
                            this.displayModal= false;
                            if(result[0].status==='ok'){
                                
                                this.getListado();
                                this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: result[0].message});
                                this.frmRechazo = false;
                                
                            }else{
                              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: result[0].message});
                            }
                        },
                        error: (err)=>{
                          this.loadingCargue = false;
                          this.displayModal= false;
                            ////console.logerr);
                        }
                    });

                
            },  
            error: (err)=>{
                ////console.logerr);
                this.loadingCargue = false;
                 this.displayModal= false;
            }
          });
    }
}

onConfirmAp() {
  this.loadingCargue = true;
  this.displayModal= true;
  this.loading = true;
  let message = "";
  this.messageService.clear('ap');
  this.comprasService.aprobacionSolped(this.authService.getToken(), this.arrayIdSolped)
      .subscribe({
        next: (aprobaciones) => {
          //console.logaprobaciones);
          this.loadingCargue = false;
          this.displayModal= false;
          let messageServiceTmp:any[] = [];
          let severity:string ="";
          
          if(aprobaciones[0].status=='error'){
            this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: aprobaciones[0].message});
          }

          if(aprobaciones[0].status=='complete'){
            
            if(aprobaciones[0].arrayErrors.length >0 && aprobaciones[0].arrayAproved.length >0){
              severity="warn";
            }else if(aprobaciones[0].arrayErrors.length >0 && aprobaciones[0].arrayAproved.length ==0){
              severity="error";
            }else if(aprobaciones[0].arrayErrors.length ==0 && aprobaciones[0].arrayAproved.length >0){
              severity="success";
            }
            this.messageService.add({key: 'tl',severity, summary: '!información', detail: aprobaciones[0].message});
          }

          for(let item of aprobaciones[0].arrayErrors){
            messageServiceTmp.push({key: 'tl',severity:'error', summary: '!Error', detail: item.message,life:5000});
          }

          for(let item of aprobaciones[0].arrayAproved){
            messageServiceTmp.push({key: 'tl',severity:'success', summary: '!Notificación¡', detail: item.message,life:5000});
          }

          this.getListado();
          this.messageService.addAll(messageServiceTmp);
          this.selectedSolped=[]
          /* 
          if(aprobaciones[0].status && aprobaciones[0].status=='error'){
            this.messageService.add({key: 't1',severity:'error', summary: '!Error', detail: aprobaciones[0].message});
          }else{

            //console.log"aqui entro");

            if(aprobaciones[0].arrayErrors.length>0){
              for(let item of aprobaciones[0].arrayErrors){
                messageServiceTmp.push({key: 'tl',severity:'error', summary: '!Error', detail: item.message,life:5000});
                //this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: item.messageSolped});
              }
            
              if(aprobaciones[0].arrayAproved.length>0){
                //this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: 'Es posible que las siguentes solicitudes no se lograran guardar debido a los errores presentados.'});
                messageServiceTmp.push({key: 'tl',severity:'warn', summary: '!información', detail: 'Es posible que las siguentes solicitudes no se lograran guardar debido a los errores presentados.',life:5000});
                for(let item of aprobaciones[0].arrayAproved){
                  //this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: item.messageSolped});
                  messageServiceTmp.push({key: 'tl',severity:'warn', summary: '!información', detail: item.message,life:5000});
                }
              }
            
            }else{
              if(aprobaciones[0].arrayAproved.length>0){
                
                for(let item of aprobaciones[0].arrayAproved){
                  //this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: item.messageSolped});
                  messageServiceTmp.push({key: 'tl',severity:'success', summary: '!Ok', detail: item.messageSolped,life:5000});
                }
              }
            }
            
            

          }*/

          
        },
        error: (err) => {
          //////console.logerr);
          this.loading = false;
          this.loadingCargue = false;
          this.displayModal= false;
          this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
        }
      });
}

clearToast() {
  this.messageService.clear();
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

 

  mostrarDetalle(solpedID:number){
    this.displayModal= true;
      this.comprasService.solpedById(this.authService.getToken(), solpedID)
          .subscribe({
                next:(solped)=>{
                  //console.logsolped);
                  let totalimpuestos = 0;
                  let subtotal =0;
                  let grantotal =0;
                  
                  for(let linea of solped.solpedDet){
                    totalimpuestos+= linea.taxvalor;
                    subtotal+= linea.linetotal;
                    grantotal+= linea.linegtotal;
                    
                  }
                  this.displayModal= false;
                  this.listadoLineas =true;
                  this.lineasSolped = solped.solpedDet;
                  this.totalimpuestos = totalimpuestos;
                  this.subtotal =   subtotal;
                  this.grantotal = grantotal;

                },
                error:(err)=>{
                    console.error(err)
                    this.displayModal= false;
                }
          })

  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.solped);
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

  
  //Deprecated
  getSeries(){
    //this.series = [{name:'SPB',code:'94'},{name:'SPS',code:'62'}];

    this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'1470000113')
        .subscribe({
            next: (series)=>{
                for(let item in series){
                    this.series.push(series[item]);
                }
              ////console.logthis.series);
              this.getListado();
                //this.series = series.filter(item => item.)
            },
            error: (err)=>{
              ////console.logerr);
            }
        });

    
  }

}

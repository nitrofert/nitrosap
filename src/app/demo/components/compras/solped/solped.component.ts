import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, ConfirmEventType, MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';




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

  urlBreadCrumb:string ="";

  @ViewChild('filter') filter!: ElementRef;

  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              private comprasService:ComprasService,
              private router:Router,
              private confirmationService: ConfirmationService, 
              private messageService: MessageService,
              private authService: AuthService) { }
              

  ngOnInit(): void {
    
     //obtener datos del usuario logueado
     /*let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
     const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
     const token = localStorage.getItem('token') || '';*/

     this.infoUsuario = this.authService.getInfoUsuario();
    console.log(this.infoUsuario);
     
     console.log(this.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     console.log(this.router.url);
     console.log(this.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     console.log('Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.urlBreadCrumb = this.router.url;

     this.statuses = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
     this.approves = [{label:'No aprobada',value:'No'},{label:'Aprobada',value:'A'},{label:'Pendiente',value:'P'},{label:'Rechazada',value:'R'}];


    this.getListado();
    
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
  }else if(this.errorSopledAprobada){
    //Mostrar dialog de error de TRM en solicitud o solicitudes seleccionada
    if(this.arraySolpedAprobadas.length > 1){

        message = `Las solicitudes ${JSON.stringify(this.arraySolpedAprobadas)} ya han sido aprobadas.`;
    }else{
      message = `La solicitud ${JSON.stringify(this.arraySolpedAprobadas)} ya ha sido aprobada`;
    }

    this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: message});
    this.errorSopledAprobada = false;
  }else if(this.errorSolpedEnviada){
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
    //console.log(this.selectedSolped);
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
        console.log(item);
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
    console.log(arrayIdSolped);
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
    this.loading = true;
    let message = "";
    this.messageService.clear('c');
    this.comprasService.envioAprobacionSolped(this.authService.getToken(), this.arrayIdSolped)
        .subscribe({
          next: (aprobaciones) => {
            console.log(aprobaciones);
            if(aprobaciones.filter((item:any)=> item.status==='error').length === 0) {

              if(this.selectedSolped.length>1){
                message = "Las solicitudes seleccionadas, han sido enviadas a aprobación";
              }else{
                message = "Las solicitud seleccionada, ha sido enviada a aprobación";
              }
              this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});
              this.getListado();
            }
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
            this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
          }
        });
}

rechazar(){
  console.log('Rechazar solcitud');
  this.arrayIdSolped = [];
  let arrayIdSolped:number[] = [];
  this.arraySolpedRechazadas = [];
  this.arraySolpedAprobadas = [];
  this.arrayErrorUsuarioAprobador =[];
  this.errorSopledARechazada = false;
  this.errorSopledAprobada = false;
  this.errorUsuarioAprobador = false;

  for(let item of this.selectedSolped){
      console.log(item);
    
      if(item.approved==='R'){
        this.errorSopledARechazada = true;
        this.arraySolpedRechazadas.push(item.id);
      }

      
      
      if(item.approved==='A'){
        this.errorSopledAprobada = true;
        this.arraySolpedAprobadas.push(item.id);
      }
      
      if(item.usersapaprobador !== this.infoUsuario.codusersap){
       
        this.errorUsuarioAprobador = true;
        this.arrayErrorUsuarioAprobador.push(item.id);
      }
      arrayIdSolped.push(item.id);
  }

  console.log(arrayIdSolped);
  this.arrayIdSolped = arrayIdSolped;
  let message = "";

  console.log('Rechazada',this.errorSopledARechazada,'Aprobada',this.errorSopledAprobada,'Usuario',this.errorUsuarioAprobador);

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
    console.log("Aprobar");
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
  console.log('Aprobar solcitudes');
  
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
      console.log(item);
    
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

      if(item.usersapaprobador !== this.infoUsuario.codusersap){
        this.errorUsuarioAprobador = true;
        this.arrayErrorUsuarioAprobador.push(item.id);
      }
      arrayIdSolped.push(item.id);
  }

  console.log(arrayIdSolped);
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
    console.log("Aprobar");
    if(arrayIdSolped.length >1){
      message =`¿Desea Continuar con la aprobación de las solicitudes seleccionadas?`;
    }else{
      message = `¿Desea Continuar con la aprobación de la solicitud seleccionada?`;
    }
    this.messageService.clear();
    this.messageService.add({key: 'ap', sticky: true, severity:'warn', summary:'Confirmación', detail:message});
  }



}

onReject() {
    this.messageService.clear('c');
    this.errorFechaAprobacion = false;
    console.log(this.arrayIdSolped);
}

onRejectAp() {
  this.messageService.clear('ap');
  console.log(this.arrayIdSolped);
}

onRejectRap(){
  this.messageService.clear('rj');
  console.log(this.arrayIdSolped);
}

onRejectCancel(){
  this.messageService.clear('cdel');
  console.log(this.arrayIdSolped);
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
          console.log(err);
          this.loading = false
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
    this.submitRechazo = true;
    
    if(!this.motivoRechazo){
      this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: 'Debe diligenciar el motivo por el cual desea rechazar la solicitud seleccionada'});
    }else{
      //Obtener aprobaciones de la solped seleccionada
      this.comprasService.aprobacionesSolped(this.authService.getToken(),this.selectedSolped[0].id)
          .subscribe({
            next: (aprobaciones)=>{
                console.log(aprobaciones);
                //Filtrar el array de aprobaciones asociados a la solped seleccionada donde el aprobador, estadoap y estadoseccion de la liena === al usuario aprobador, estadoseccion activo y estado de aprobacion line a en P
                let lineaAprobacionUsuario = aprobaciones.filter(item => item.usersapaprobador === this.infoUsuario.codusersap && item.estadoseccion==='A' && item.estadoap==='P');
                console.log(lineaAprobacionUsuario);
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
                            console.log(result);
                            if(result[0].status==='ok'){
                                
                                this.getListado();
                                this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: result[0].message});
                                this.frmRechazo = false;
                                
                            }else{
                              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: result[0].message});
                            }
                        },
                        error: (err)=>{
                            console.log(err);
                        }
                    });

                
            },  
            error: (err)=>{
                console.log(err);
            }
          });
    }
}

onConfirmAp() {
  this.loading = true;
  let message = "";
  this.messageService.clear('ap');
  this.comprasService.aprobacionSolped(this.authService.getToken(), this.arrayIdSolped)
      .subscribe({
        next: (aprobaciones) => {
          console.log(aprobaciones);

          let messageServiceTmp:any[] = [];

          if(aprobaciones.arrayErrors.length>0){
            for(let item of aprobaciones.arrayErrors){
              messageServiceTmp.push({key: 'tl',severity:'error', summary: '!Error', detail: item.messageSolped,life:5000});
              //this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: item.messageSolped});
            }
            if(aprobaciones.arrayAproved.length>0){
              //this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: 'Es posible que las siguentes solicitudes no se lograran guardar debido a los errores presentados.'});
              messageServiceTmp.push({key: 'tl',severity:'warn', summary: '!información', detail: 'Es posible que las siguentes solicitudes no se lograran guardar debido a los errores presentados.',life:5000});
              for(let item of aprobaciones.arrayAproved){
                //this.messageService.add({key: 'tl',severity:'warn', summary: '!información', detail: item.messageSolped});
                messageServiceTmp.push({key: 'tl',severity:'warn', summary: '!información', detail: item.messageSolped,life:5000});
              }
            }
          }else{
            if(aprobaciones.arrayAproved.length>0){
              
              for(let item of aprobaciones.arrayAproved){
                //this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: item.messageSolped});
                messageServiceTmp.push({key: 'tl',severity:'success', summary: '!Ok', detail: item.messageSolped,life:5000});
              }
            }
          }
          this.getListado();
          this.messageService.addAll(messageServiceTmp);



          /*if(aprobaciones.filter((item:any)=> item.status==='error').length === 0) {

            if(this.selectedSolped.length>1){
              message = "Las solicitudes seleccionadas, han sido aprobadas";
            }else{
              message = "Las solicitud seleccionada, ha sido enviada a aprobación";
            }
            this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});
            this.getListado();
          }*/
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
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

  getListado(){
    this.comprasService.listSolped(this.authService.getToken())
    .subscribe({
      next:(solped =>{
        this.loading = false;
          console.log(solped);
          this.solped = solped;
          this.loading = false;
      }),
      error:(err =>{
        console.log(err);
      })
    });
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-tracking-mp',
  providers: [MessageService, ConfirmationService],
  templateUrl: './tracking-mp.component.html',
  styleUrls: ['./tracking-mp.component.scss']
})
export class TrackingMPComponent implements OnInit {

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  urlBreadCrumb:string ="";

  allSolpedMP:any[] = [];


  allSolpedMP2:any[] = [];

  solpedRequest:any[] = [];
  loadingSR:boolean = true;
  selectedSolpedR:any[] = [];

  solpedOrdered:any[] = [];
  loadingSO:boolean = true;
  selectedSolpedO:any[] = [];

  solpedShipped:any[] = [];
  loadingSS:boolean = true;
  selectedSolpedS:any[] = [];

  solpedDischarge:any[] = [];
  loadingSD:boolean = true;
  selectedSolpedD:any[] = [];


  statuses:any[] = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
  approves:any[] = [{label:'No aprobada',value:'No'},{label:'Aprobada',value:'A'},{label:'Pendiente',value:'P'},{label:'Rechazada',value:'R'}];


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
     this.urlBreadCrumb = this.router.url;

     this.getListadoSolpedMP();
  }

  getListadoSolpedMP(){
    //console.log('Listado de solpeds');
    /*this.comprasService.SolpedMPSL(this.authService.getToken())
    .subscribe({
      next:(solped =>{
        console.log(solped);
          
          this.allSolpedMP = solped;
          
          this.agruparSolped();

          this.getSolpedRequest();
          this.getSolpedOrdered();
          this.getSolpedShipped();
          this.getSolpedDischarge();

          

      }),
      error:(err =>{
        console.log(err);
      })
    });*/

    this.getSolpedRequest();
          this.getSolpedOrdered();
          this.getSolpedShipped();
          this.getSolpedDischarge();
  }

  agruparSolped(){
    let resultQuery:any[] =[];
    let LineaSolpedDet!:any;
    for(let solped of this.allSolpedMP){
      for(let solpedDet of solped.DocumentLines){
        LineaSolpedDet = {DocNum:solped.DocNum,
                               key:solped.DocNum+'-'+solpedDet.LineNum,
                               DocEntry:solped.DocEntry,
                               U_NF_STATUS:solped.U_NF_STATUS,
                               LineNum:solpedDet.LineNum,
                               ItemCode:solpedDet.ItemCode,
                               ItemDescription:solpedDet.ItemDescription,
                               U_NF_LASTSHIPPPING:solped.U_NF_LASTSHIPPPING,
                               U_NF_DATEOFSHIPPING: solped.U_NF_DATEOFSHIPPING,
                               RequriedDate:solped.RequriedDate,
                               U_NF_AGENTE:solped.U_NF_AGENTE,
                               U_NF_PAGO:solped.U_NF_PAGO,
                               Quantity:solpedDet.Quantity,
                               Incoterms:solpedDet.Incoterms,
                               U_NF_TIPOCARGA:solped.U_NF_TIPOCARGA,
                               U_NF_PUERTOSALIDA:solped.U_NF_PUERTOSALIDA,
                               WarehouseCode:solpedDet.WarehouseCode,
                               U_NF_MOTONAVE:solped.U_NF_MOTONAVE,
                               Comments:solped.Comments
                              };
          resultQuery.push(LineaSolpedDet);
      }
    }
    this.allSolpedMP2 = resultQuery;
    //console.log(this.allSolpedMP2);
  }

  getSolpedRequest(){
    this.comprasService.SolpedMP(this.authService.getToken(),'Request')
    .subscribe({
      next:(solped =>{
        this.solpedRequest = solped;
      }),
      error:(err =>{
        console.log(err);
      })
    });

    //this.solpedRequest = this.allSolpedMP2.filter(solped=>solped.U_NF_STATUS ==='Request');
    //console.log('SR',this.solpedRequest);
    //this.loadingSR = false;
  }

  getSolpedOrdered(){
    //this.solpedOrdered = this.allSolpedMP.filter(solped=>solped.U_NF_STATUS ==='Ordered');
    //console.log('SO',this.solpedOrdered);
    //this.loadingSO = false;

    this.comprasService.SolpedMP(this.authService.getToken(),'Ordered')
    .subscribe({
      next:(solped =>{
        this.solpedOrdered = solped;
      }),
      error:(err =>{
        console.log(err);
      })
    });

  }
  
  getSolpedShipped(){
    //this.solpedShipped = this.allSolpedMP.filter(solped=>solped.U_NF_STATUS ==='Shipped');
    //console.log('SS',this.solpedShipped);
    //this.loadingSS = false;

    this.comprasService.SolpedMP(this.authService.getToken(),'Shipped')
    .subscribe({
      next:(solped =>{
        this.solpedShipped = solped;
      }),
      error:(err =>{
        console.log(err);
      })
    });
  }

  getSolpedDischarge(){
    //this.solpedDischarge = this.allSolpedMP.filter(solped=>solped.U_NF_STATUS ==='Discharge');
    //console.log('SD',this.solpedDischarge);
    //this.loadingSD = false;
    this.comprasService.SolpedMP(this.authService.getToken(),'Discharge')
    .subscribe({
      next:(solped =>{
        this.solpedDischarge = solped;
      }),
      error:(err =>{
        console.log(err);
      })
    });
  }

  newSolped(){}

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

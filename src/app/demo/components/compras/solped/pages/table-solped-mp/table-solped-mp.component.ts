import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'app-table-solped-mp',
  providers: [MessageService, ConfirmationService],
  templateUrl: './table-solped-mp.component.html',
  styleUrls: ['./table-solped-mp.component.scss']
})
export class TableSolpedMPComponent implements OnInit, OnChanges {

  @Input() solpedList!:any;
  @Input() color!:any;
  @Input() showNuevo!:any;
  @Input() showEditar!:any;
  @Input() showEnvioSAP!:any;

  

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];



 
  
  loading:boolean = true;
  selectedSolped:any[] = [];


  formulario:boolean = false;
  envioFormulario:boolean = false;

  estados:any[] = [{name:'Request'},{name:'Ordered'},{name:'Shipped'},{name:'Discharge'}];
  u_nf_status!:any;

  u_nf_lastshippping!:any;
  u_nf_dateofshipping!:any;
  RequriedDate!:any;
  cantidad!:any;
  cantidadkl!:any;
  comentarios:any;

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

     //console.log(this.solpedList);
    //this.getSolpedList();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes['solpedList'].currentValue);
    if(changes['solpedList'].currentValue.length>0){
      this.getSolpedList();
    }else{
      setTimeout(()=>{this.getSolpedList();},5000)
    }
  }
  

  getSolpedList(){
    //this.solpedList = this.solpedListestado;

    this.loading = false;
    //console.log(this.solpedList[0].DocumentLines);
  }
 

  newSolped(){

    this.router.navigate(['/portal/compras/solped/nueva-mp']);
  }

  editSolped(){
    //console.log(this.selectedSolped); 
    /*this.formulario = true;
    this.asignarCampos();*/

    this.router.navigate(['/portal/compras/solped/editar-mp',this.selectedSolped[0].id]);
  }

  asignarCampos(){
    //console.log();
    this.u_nf_status = this.estados.filter(estado=>estado.name.toLowerCase() == this.selectedSolped[0].U_NF_STATUS.toLowerCase());
    this.u_nf_lastshippping = new Date(this.selectedSolped[0].U_NF_LASTSHIPPPING);
    this.u_nf_dateofshipping = new Date(this.selectedSolped[0].U_NF_DATEOFSHIPPING);
    this.RequriedDate = new Date(this.selectedSolped[0].RequriedDate);
    this.cantidad = this.selectedSolped[0].Quantity;
    this.cantidadkl = this.selectedSolped[0].Quantity*1000;
    this.comentarios = this.selectedSolped[0].Comments;
  }

  calcularCantidadKL(){}

  ActualizarSolped(){
    let infoSolpedUpdate:any = {
      solped:{
          DocEntry:this.selectedSolped[0].DocEntry,
          DocNum:this.selectedSolped[0].DocNum,
          U_NF_STATUS:this.u_nf_status,
          U_NF_LASTSHIPPPING:this.u_nf_lastshippping,
          U_NF_DATEOFSHIPPING:this.u_nf_dateofshipping,
          RequriedDate:this.RequriedDate,
          
      },
      solpedDet:{
        LineNum:this.selectedSolped[0].LineNum,
        Quantity:this.cantidad,
        Comments: this.comentarios
      }
    }


  }

  envairSAP(){
      //console.log('Envio a SAP',this.selectedSolped);
      if(this.selectedSolped[0].approved=='N'){
        this.comprasService.enviarSolpedSAP(this.authService.getToken(),{id:this.selectedSolped[0].id})
            .subscribe({
                next:(result)=>{
                    //console.log(result);
                    this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                },
                error:(err)=>{
                  console.log(err);
                }
            });
      }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: 'La solped seleccionada fue ya fue enviada a SAP'});
      }
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

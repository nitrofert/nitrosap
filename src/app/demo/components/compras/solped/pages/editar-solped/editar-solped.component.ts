import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService,  Message, MenuItem } from 'primeng/api';
import { CuentasSAP } from 'src/app/demo/api/accountsSAP';
import { BusinessPartners } from 'src/app/demo/api/businessPartners';
import { DependenciasUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ItemsSAP } from 'src/app/demo/api/itemsSAP';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { Solped, SolpedDet, SolpedInterface } from 'src/app/demo/api/solped';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';


interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-editar-solped',
  providers:[MessageService],
  templateUrl: './editar-solped.component.html',
  //templateUrl: './tmplateemail.html',
  styleUrls: ['./editar-solped.component.scss'],
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
export class EditarSolpedComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;
  idSolpedSelected:any;
  
  solped!:Solped;
  solpedDet!:SolpedDet;
  solpedDetLines:SolpedDet[] = [];
  lineaDetalle:number = 0;
  selectedLineSolped:SolpedDet[] = [];

  businessPartners:BusinessPartners[] = [];
  selectedBusinessPartners:any;

  itemsSAP:ItemsSAP[] = [];
  selectedItemSAP:any;
  cuentasSAP:CuentasSAP[] = [];
  
  cuentasDependencia:CuentasSAP[] = [];
  selectedCuentaSAP:any;

  monedas:any[] = [{Currency:  'COP',TRM:1}];
  selectedMoneda:any="";

  subtotal:number = 0;
  grantotal:number = 0;
  totalimpuestos:number = 0;

  clasesSolped:any[] =[{code:"I", name:"Artículo"},{code:"S",name:"Servicio"}];

  submitted:boolean = false;
  submittedBotton:boolean = false;
  submittedLine:boolean = false;
  submittedBottonLine:boolean = false;
  requestLine:boolean = false;
  formDetalle:boolean = false;
  listDetalle:boolean = false;
  loading: boolean = false;
  infoUsuario!:InfoUsuario;
  
  filteredItems:any[] = [];
  filteredProveedores:any[] = [];
  filteredCuentas:any[] = [];
  dependenciasUser:DependenciasUsuario[]=[];
  locations:DependenciasUsuario[] = [];
  //selectedLocation!:DependenciasUsuario;
  selectedLocation:any;
  dependencies:DependenciasUsuario[] = [];
  //selectedDependencie!:DependenciasUsuario;
  selectedDependencie:any;
  vicepresidencies:DependenciasUsuario[] = [];
  //selectedVicepresidency!:DependenciasUsuario;
  selectedVicepresidency:any;
  stores:any[] = [];
  selectedStore!:any;
  taxes: any[] = [];
  selectedTax:any;
  //valortax:number = 0;
  taxprc:number = 0;
  series: any[] = [{name:'SPB',code:'SPB'},{name:'SPS',code:'SPS'}];
  areasUser:any[] =[];
  selectedArea:string = '';

  editForm:boolean = false;
  indexSolpedLineEdit!:number;

  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];



  constructor(private rutaActiva: ActivatedRoute,
    private messageService: MessageService,
    private adminService: AdminService,
    public authService: AuthService,
    private sapService:SAPService,
    private router:Router,
    private comprasService: ComprasService) { 
      console.log("constructor");
    }

  ngOnInit(): void {
    console.log("on initialized");

    this.infoUsuario = this.authService.getInfoUsuario();
    this.clearFormEncabezado()
    this.clearFormDetalle();
    // Obtener id de la solped seleccionada
    this.idSolpedSelected = this.rutaActiva.snapshot.params;
    console.log((this.idSolpedSelected.solped));
    console.log(this.router.url);
    console.log("/"+this.idSolpedSelected.solped);
    console.log(this.router.url.indexOf("/"+this.idSolpedSelected.solped));
    console.log(this.router.url.substring(0,this.router.url.indexOf("/"+this.idSolpedSelected.solped)));
    let url = this.router.url;
    if(this.router.url.indexOf("/"+this.idSolpedSelected.solped)>=0){
      url = this.router.url.substring(0,this.router.url.indexOf("/"+this.idSolpedSelected.solped));
    }

    
    console.log(this.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     console.log('Permisos pagina',this.permisosUsuario.filter(item => item.url===url));
     this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);

    //Cargar datos de la solped por el id
    this.comprasService.solpedById(this.authService.getToken(),this.idSolpedSelected.solped)
        .subscribe({
          next: (solped)=>{
            console.log(solped);
            this.solped = solped.solped;
            console.log(this.solped);
            this.solped.docdate = new Date(solped.solped.docdate);
            this.solped.docduedate = new Date(solped.solped.docduedate);
            this.solped.taxdate = new Date(solped.solped.taxdate);
            this.solped.reqdate = new Date(solped.solped.reqdate);
            console.log(this.solped.u_nf_depen_solped);
            this.solpedDetLines = solped.solpedDet;
            
            this.getMaxlinenumDet();
            this.getDependenciasUsuario();
            this.getAreasUser();
            this.getProveedoresSAP();
            this.getItemsSAP();
            this.getCuentasSAP();
            this.getImpuestos();    
            this.getAlmacenesUsuario();
            this.getMonedas();
            
    
          }, 
          error: (error)  => {
              console.log(error);
          }
        });
    
  }

  getMaxlinenumDet(){
   //console.log(this.solpedDetLines,"ok");
    let maxLinenum = 0;
    for(let item of this.solpedDetLines){
        if(item.linenum>maxLinenum){
          maxLinenum = item.linenum;
        }
    }
    this.lineaDetalle = maxLinenum+1;
    //console.log(this.lineaDetalle);
  }

  getDependenciasUsuario(){
    //Cargar dependencias de usuario XEngine SAP
    

        this.authService.getDependeciasUsuarioXE()
        .subscribe({
          next: (dependenciasUser) => {
            for(let item in dependenciasUser){
              this.dependenciasUser.push(dependenciasUser[item]);
            }
           //console.log(this.dependenciasUser);

            for(let dependencia of this.dependenciasUser){
                if((this.vicepresidencies.filter(data => data.vicepresidency === dependencia.vicepresidency)).length ===0){
                  this.vicepresidencies.push(dependencia);
                }
            }
            //console.log(this.vicepresidencies);
          },
          error: (error) => {
            console.log(error);
          }
        });
  }

  getAreasUser(){
     //Cargar areas x usuario  XEngine SAP
    
     this.authService.getAreasUsuarioXE()
     .subscribe({
       next: (areasUser) => {
         for(let item in areasUser){
           this.areasUser.push(areasUser[item]);
         }
        //console.log(this.dependenciasUser);
        this.selectedArea= this.solped.u_nf_depen_solped;
      
       },
       error: (error) => {
         console.log(error);
       }
     });
  }

  getCuentasSAP(){
     //Cargar cuentas SAP
     this.sapService.CuentasSAPSL(this.authService.getToken())
     .subscribe({
       next: (cuentasSAP) => {
         //console.log(cuentasSAP);
         this.cuentasSAP = cuentasSAP;
       },
       error: (error) => {
           console.log(error);      
       }
     });

  }

  getProveedoresSAP(){
    //Cargar Proveedores XEngine SAP

        this.sapService.BusinessPartnersXE(this.authService.getToken())
        .subscribe({
          next: (businessPartners) => {
            for(let item in businessPartners){
              this.businessPartners.push(businessPartners[item]);
           }
           //console.log(this.businessPartners);
          },
          error: (error) => {
              console.log(error);      
          }
        });
  }

  getItemsSAP(){
      //Cargar Items SAP
      this.sapService.ItemsSAPSL(this.authService.getToken())
      .subscribe({
        next: (itemsSAP) => {
          //console.log(itemsSAP);
          this.itemsSAP = itemsSAP;
        },
        error: (error) => {
            console.log(error);      
        }
      });
  
  }

  getImpuestos(){
     //Cargar impuestos XEngine SAP
     this.comprasService.taxesXE(this.authService.getToken())
     .subscribe({
       next: (taxes) => {
         
         for(let item in taxes){
           this.taxes.push(taxes[item]);  
         }
         //console.log(this.taxes);
       },
       error: (error) => {
           console.log(error);      
       }
     });
  }

  getAlmacenesUsuario(){
    //Cargar almacenes x usuario XEngine SAP
        this.authService.getAlmacenesUsuarioXE()
        .subscribe({
          next: (stores) => {
            for(let item in stores){
              this.stores.push(stores[item]);
            }
           //console.log(this.stores);
          },
          error: (error) => {
              console.log(error);      
          }
        });
  }

  getMonedas(){
      //Cargar Monedas XEngine SAP
      console.log(this.solped.docdate);
      this.sapService.monedasXEngineSAP(this.authService.getToken(),this.solped.docdate.toISOString())
      .subscribe({
        next: (monedas) => {
          for(let item in monedas){
             this.monedas.push(monedas[item]);
          }
          console.log(this.monedas);
          this.setTRMSolped('USD');
        },
        error: (error) => {
            console.log(error);      
        }
      });
  }

  selectFechaCont(){
    

    this.sapService.monedasXEngineSAP(this.authService.getToken(),this.solped.docdate.toISOString())
    .subscribe({
      next: (monedas) => {
       
        this.monedas = [{Currency:  'COP',TRM:1}];
        for(let item in monedas){
           console.log(monedas[item]);
           this.monedas.push(monedas[item]);
           
        }
        console.log(this.monedas);
        this.setTRMSolped('USD');
      },
      error: (error) => {
          console.log(error);      
      }
    });

  }

  setTRMSolped(currency:string){
    
    if(this.monedas.filter(moneda => moneda.Currency === currency).length >0){
      this.solped.trm = this.monedas.filter(moneda => moneda.Currency === currency)[0].TRM;
    }else{
      this.solped.trm = 0;
    }
    console.log(this.solped.trm);
  }
  
  adicionarLinea(){
    this.requestLine = true;
  
    //console.log(this.solped);
    if(this.solped.fullname &&   this.solped.doctype &&  this.solped.serie && this.solped.docdate && this.solped.docduedate && this.solped.taxdate && this.solped.reqdate){
      
      this.clearFormDetalle();
      this.showFormDetalle();
    }else{
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }
  }

  showFormDetalle(){
      this.formDetalle = true;
      this.requestLine = false;
  }

  filterItems(event:any){
     
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.itemsSAP.length; i++) {
        let itemSAP = this.itemsSAP[i];
         /*if ( (itemSAP.ItemCode+itemSAP.ItemName.toLowerCase()).includes(query.toLowerCase()) ) {
            filtered.push(itemSAP);
         }*/

         if((itemSAP.ItemCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
            (itemSAP.ItemName.toLowerCase().indexOf(query.toLowerCase())>=0)){
           //console.log(itemSAP);
           filtered.push(itemSAP);
        }
    }
    this.filteredItems = filtered;
 }

  
  filterProveedores(event:any){
     
    let filtered : any[] = [];
    let businessPartner:any;
    let query = event.query;
    for(let i = 0; i < this.businessPartners.length; i++) {
         businessPartner = this.businessPartners[i];
         if((businessPartner.CardCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
            (businessPartner.CardName.toLowerCase().indexOf(query.toLowerCase())>=0)){
            console.log(businessPartner);
            filtered.push(businessPartner);
         }
    }
    this.filteredProveedores = filtered;
 }

 selectProveedor(){
    this.solpedDet.linevendor = this.selectedBusinessPartners.CardCode;
 }

 filterCuentas(event:any){
     
  let filtered : any[] = [];
  let query = event.query;
  /*for(let i = 0; i < this.cuentasSAP.length; i++) {
      let cuentaSAP = this.cuentasSAP[i];
      if(cuentaSAP.Code!=null && cuentaSAP.Name!=null){
        
        if((cuentaSAP.Code.toLowerCase().indexOf(query.toLowerCase())>=0) ||
          (cuentaSAP.Name.toLowerCase().indexOf(query.toLowerCase())>=0)){
          console.log(cuentaSAP);
          filtered.push(cuentaSAP);
       }
      }
       
  }*/

  for(let i = 0; i < this.cuentasDependencia.length; i++) {
    let cuentaDependencia = this.cuentasDependencia[i];
    if(cuentaDependencia.Code!=null && cuentaDependencia.Name!=null){
      
      if((cuentaDependencia.Code.toLowerCase().indexOf(query.toLowerCase())>=0) ||
        (cuentaDependencia.Name.toLowerCase().indexOf(query.toLowerCase())>=0)){
        console.log(cuentaDependencia);
        filtered.push(cuentaDependencia);
     }
    }
  }
  this.filteredCuentas = filtered;
}

  selectedSerie(){
    console.log(this.solped.serie);

    this.clearFormDetalle();
    
    if(this.solped.serie=='SPB'){
      this.solped.doctype ='I';
    }else{
      this.solped.doctype ="";
    }
  }

  selectArea(){
      console.log(this.selectedArea);
      this.solped.u_nf_depen_solped = this.selectedArea;
  }

  selectedItemCode(){
    
    this.solpedDet.itemcode = this.selectedItemSAP.ItemCode;
    this.solpedDet.dscription = this.selectedItemSAP.ItemName;
    if(this.selectedItemSAP.ApTaxCode){
      console.log(this.selectedItemSAP);
      this.selectedTax = this.taxes.filter(item => item.Code === this.selectedItemSAP.ApTaxCode)[0];
      console.log(this.selectedTax);
      this.solpedDet.tax = this.selectedItemSAP.ApTaxCode;
      this.selectedImpuesto();
    }
    //this.descripcionReadOnly = true;
    //this.acctcodeReadonly = true;
    this.solpedDet.acctcode = "";
    this.selectedCuentaSAP = "";
    this.solpedDet.acctcodename = "";
  }
  clearItemCode(){
     this.solpedDet.itemcode = "";
     this.solpedDet.dscription = "";
  }

  selectedCuenta(){
    console.log(this.selectedCuentaSAP);
    this.solpedDet.acctcode = this.selectedCuentaSAP.Code;
    this.solpedDet.acctcodename = this.selectedCuentaSAP.Name;
  }

  selectedOcrcode3(){
   
    if(this.selectedVicepresidency){
      this.solpedDet.ocrcode3 = this.selectedVicepresidency.vicepresidency || ''
      //console.log(this.solpedDet.ocrcode3,this.selectedVicepresidency);
      //console.log(this.dependenciasUser.filter((data => data.vicepresidency === this.solpedDet.ocrcode3))); 
      
      this.loadOcrcode2();
    }else{
      this.solpedDet.ocrcode3="";
  
    }
    //console.log(this.dependencies);
  }

  loadOcrcode2(){
    console.log(this.solpedDet.ocrcode3);
    let dependenciesTMP = this.dependenciasUser.filter((data => data.vicepresidency === this.solpedDet.ocrcode3));
      
      for(let dependencia of dependenciesTMP){
        if((this.dependencies.filter(data => data.dependence === dependencia.dependence)).length ===0){
          this.dependencies.push(dependencia);
        }
      }
  }

  selectedOcrcode2(){
    
    if(this.selectedDependencie){
      this.solpedDet.ocrcode2 = this.selectedDependencie.dependence || ''
      //console.log(this.solpedDet.ocrcode2,this.selectedDependencie.dependence);
      //console.log(this.dependenciasUser.filter((data => data.vicepresidency === this.solpedDet.ocrcode3)));
      
      this.loadOcrcode();
            //Llenar cuentas segun  dependencia seleccionada
      //Obtener cuentas asociadas a la dependencia
      this.cuentasxDependencia();

    }else{
      this.solpedDet.ocrcode2="";
    }
  }

  loadOcrcode(){
    let dependenciesTMP = this.dependenciasUser.filter((data => (data.dependence === this.solpedDet.ocrcode2 && data.vicepresidency === this.solpedDet.ocrcode3)));
  
      for(let dependencia of dependenciesTMP){
        if((this.locations.filter(data => data.location === dependencia.location)).length ===0){
          this.locations.push(dependencia);
        }
      }
  }

  
  cuentasxDependencia(){
      this.sapService.cuentasPorDependenciaXE(this.authService.getToken(),this.solpedDet.ocrcode2)
          .subscribe({
              next: (cuentas) => {
                console.log(cuentas);
                let arrayCuentasDep = [];
                for(let item in cuentas){
                  arrayCuentasDep.push(cuentas[item].U_NF_CUENTA);
                }
                let CuentaSAP:any;
                let filtered: any[] = [];

                for(let i = 0; i < this.cuentasSAP.length; i++) {
                  CuentaSAP = this.cuentasSAP[i]; 
                  for(let item of arrayCuentasDep){
                    if((CuentaSAP.Code.indexOf(item)==0)){
                    //console.log(businessPartner);
                    filtered.push(CuentaSAP);
                    }
                  }
                }
                console.log(filtered);
                this.cuentasDependencia = filtered;
              },
              error: (err) => {
                console.log(err);
              }
          });
  }


  selectedImpuesto(){
    //console.log(this.selectedTax);
    if(!this.selectedTax){
      this.taxprc = 0;
    }else{
      this.solpedDet.tax = this.selectedTax.Code;
      
      this.taxprc = this.selectedTax.tax;
      this.impuestoLinea();
    }
    
  }

  subtotalLinea(){
    //console.log(this.solpedDet.quantity,this.solpedDet.price);
    if(!this.solpedDet.quantity || !this.solpedDet.price){
      this.solpedDet.linetotal =0;
    }else{
      this.solpedDet.linetotal = this.solpedDet.quantity * (this.solpedDet.price*(this.solpedDet.trm || 0));
      
    }
    this.impuestoLinea(); 
  }

  impuestoLinea(){
    console.log(this.solpedDet.tax,this.solpedDet.linetotal);
    if(!this.solpedDet.tax || this.solpedDet.linetotal ==0){
      this.solpedDet.taxvalor =0;
    }else{
      ///console.log("Calcula impuesto")
      this.solpedDet.taxvalor =this.solpedDet.linetotal*(this.taxprc/100);

      
    }
    this.totalLine();
  }

  totalLine(){
    this.solpedDet.linegtotal = this.solpedDet.linetotal+this.solpedDet.taxvalor;
  }

  registrarLinea(){
    this.submittedLine =true;
    this.submittedBottonLine = true;
    if(this.solpedDet.dscription && 
      this.solpedDet.reqdatedet && 
      this.solpedDet.ocrcode3 && 
      this.solpedDet.ocrcode2 && 
      this.solpedDet.ocrcode && 
      this.solpedDet.quantity &&
      this.solpedDet.price &&
      this.solpedDet.tax &&
      ((this.solpedDet.acctcode && !this.solpedDet.itemcode) || (!this.solpedDet.acctcode && this.solpedDet.itemcode))){
       
        let indexLineaDuplicada = this.lineaDuplicada();
        console.log(indexLineaDuplicada);
        if(indexLineaDuplicada>=0 && indexLineaDuplicada!==this.solpedDet.linenum){
          this.messageService.add({severity:'warn', 
                                   summary: '!Atención', 
                                   detail: `Los datos de item: ${this.solpedDet.itemcode}, 
                                            Vicepresidencia: ${this.solpedDet.ocrcode3}, 
                                            Dependencia: ${this.solpedDet.ocrcode2} y 
                                            localidad: ${this.solpedDet.ocrcode} 
                                            ya se encuentran registrados en la 
                                            linea ${indexLineaDuplicada} de esta solped`});    
        }else{
              if(this.editForm){
                this.solpedDetLines.splice(this.indexSolpedLineEdit,1,this.solpedDet);
                this.messageService.add({severity:'success', summary: '!Ok¡', detail: 'Se realizo correctamente la actualización de la línea'});
                this.editForm = false;
              }else{
                this.solpedDet.id_user = this.infoUsuario.id;
                this.solpedDet.linenum = this.lineaDetalle;
                this.solpedDet.id_solped = this.solped.id || 0;
                //console.log('registro de linea');
                this.solpedDetLines.push(this.solpedDet);
                this.lineaDetalle++;
                //console.log(this.solpedDet);
                this.messageService.add({severity:'success', summary: '!Ok¡', detail: 'Se realizo correctamente el registro de la línea'});
              }
              //realizar el proceso de registro de linea
              this.calculatTotales();
              this.submittedLine =false;
              //this.formDetalle=false;
              this.clearFormDetalle();
              setTimeout(()=>{
                this.formDetalle =false;
              },2000);
              
              //this.submittedBottonLine = false;
        }
    }else{
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }

    this.submittedBottonLine = false;


    
  }

  lineaDuplicada():number{
    let sameLine = this.solpedDetLines.filter(line => line.itemcode === this.solpedDet.itemcode && 
      line.dscription === this.solpedDet.dscription &&
      line.ocrcode === this.solpedDet.ocrcode && 
    line.ocrcode2 === this.solpedDet.ocrcode2 &&
    line.ocrcode3 === this.solpedDet.ocrcode3);
    console.log(this.solpedDetLines.indexOf(sameLine[0]));
    return this.solpedDetLines.indexOf(sameLine[0]); 
  }


  
  showDetalle(){
    this.listDetalle =  true;
    this.calculatTotales();
    
    //console.log(this.selectedLineSolped.length,this.selectedLineSolped);
  }

  calculatTotales(){
    this.totalimpuestos =0;
    this.subtotal = 0;
    this.grantotal = 0;

    for(let item of this.solpedDetLines){
      this.totalimpuestos +=item.taxvalor;
      this.subtotal += item.linetotal;
      this.grantotal += item.linegtotal;
    }
  }

  selectedOcrcode(){
   
    if(this.selectedLocation){
      this.solpedDet.ocrcode = this.selectedLocation.location || '';
    }else{
      this.solpedDet.ocrcode="";
    }
    
  }

  editarLinea(){
    //console.log(this.selectedLineSolped[0]);
    this.solpedDet = this.selectedLineSolped[0];
    console.log(this.solpedDet);
    this.solpedDet.reqdatedet = new Date(this.solpedDet.reqdatedet);
    this.indexSolpedLineEdit = this.solpedDetLines.indexOf(this.solpedDet);
    //console.log(this.indexSolpedLineEdit);
    this.editForm = true;
    this.loadOcrcode2();
    this.loadOcrcode();
    this.showFormDetalle();
    if(this.solpedDet.itemcode){
      this.selectedItemSAP = this.itemsSAP.filter(item => item.ItemCode ===this.solpedDet.itemcode)[0];
    }
    if(this.solpedDet.linevendor){
      this.selectedBusinessPartners = this.businessPartners.filter(item =>item.CardCode === this.solpedDet.linevendor)[0];
    }
    if(this.solpedDet.acctcode){
      this.selectedCuentaSAP = this.cuentasSAP.filter(item =>item.Code === this.solpedDet.acctcode)[0];
    }

    if(this.solpedDet.ocrcode3){
      this.selectedVicepresidency = this.vicepresidencies.filter(item =>item.vicepresidency === this.solpedDet.ocrcode3)[0];
    }

    if(this.solpedDet.ocrcode2){
      //console.log(this.dependencies);
      this.selectedDependencie = this.dependencies.filter(item =>item.dependence === this.solpedDet.ocrcode2)[0];
    }

    if(this.solpedDet.ocrcode){
      //console.log(this.locations);
      this.selectedLocation = this.locations.filter(item =>item.location === this.solpedDet.ocrcode)[0];
    }

    if(this.solpedDet.whscode){
      this.selectedStore = this.stores.filter(item => item.store === this.solpedDet.whscode)[0];
    }

    if(this.solpedDet.tax){
      this.selectedTax = this.taxes.filter(item =>item.Code === this.solpedDet.tax)[0];
    }

    this.taxprc = ((this.solpedDet.linegtotal/this.solpedDet.linetotal)-1)*100;
    this.solpedDet.taxvalor = this.solpedDet.linegtotal*(this.taxprc/100);
    
    //console.log(this.selectedItemSAP);
  }

  borrarLineas(){
    //console.log(this.selectedLineSolped);
    for(let line of this.solpedDetLines){
        for(let lineSelected of this.selectedLineSolped){
            if(line === lineSelected){
              //console.log(lineSelected);
              //console.log( this.solpedDetLines.indexOf(line));
              this.solpedDetLines.splice(this.solpedDetLines.indexOf(line),1);
              this.selectedLineSolped.splice(this.selectedLineSolped.indexOf(line),1);
            }
        }
    }
    //console.log(this.selectedLineSolped,this.solpedDetLines);
  }

  selectStore(){
    console.log(this.selectedStore); 
    this.solpedDet.whscode = this.selectedStore.store;
    console.log(this.solpedDet.whscode);
  }

  
  selectLine(){
    console.log(this.selectedLineSolped.length, this.selectedLineSolped);
  }

  selectMoneda(){
    console.log(this.solpedDet.moneda);
    this.solpedDet.trm= this.monedas.filter(item => item.Currency === this.solpedDet.moneda)[0].TRM;
    console.log(this.solpedDet.trm);
    this.subtotalLinea();
  }

  nuevaSolped(){
    this.router.navigate(['/portal/compras/solped/nueva']);
  }

  saveSolped(){
    this.submitted = true;
    if(this.solped.fullname &&   this.solped.doctype &&  this.solped.serie && this.solped.docdate && this.solped.docduedate && this.solped.taxdate && this.solped.reqdate){
      if(this.solpedDetLines.length > 0){

        console.log(this.solped, this.solpedDetLines);

        const data:any = {
          solped:this.solped,
          solpedDet:this.solpedDetLines
        }

        this.comprasService.updateSolped(this.authService.getToken(),data)
            .subscribe({
                next: (result) =>{
                    console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                    }else{
                      this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                      setTimeout(()=>{
                        this.router.navigate(['portal/compras/solped']);
                      },2000);
                    }
                },
                error: (err) =>{
                  console.log(err);
                }
            });

        this.submitted = false;
      }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar al menos una línea en la solped'});
      }
      
    }else{
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }
    
  }

  clearFormEncabezado(){
    this.solped = {
     
      id_user: this.infoUsuario.id,
      usersap: this.infoUsuario.codusersap,
      fullname: this.infoUsuario.fullname,
      serie:"",
      doctype: "",
      docdate:new Date(),
      docduedate:new Date(),
      taxdate:new Date(),
      reqdate:new Date(),
      sapdocnum:"0",
      approved: '',
      u_nf_depen_solped:"",
      comments:"",
      trm:0
    };

  }

  clearFormDetalle(){
    this.solpedDet ={
      id_solped:   0,
      linenum:      -1,
      itemcode:     "",
      dscription:   "",
      reqdatedet:   new Date(),
      linevendor:   "",
      acctcode:     "",
      acctcodename: "",
      quantity:     1,
      price:        0,
      moneda: "COP",
      trm:          1,
      linetotal:    0,
      tax:         0,
      taxvalor:0,
      linegtotal:   0,
      ocrcode:      "",
      ocrcode2:     "",
      ocrcode3:     "",
      whscode: "",
      id_user:     0,
    };

    this.selectedItemSAP="";
        this.selectedBusinessPartners ="";
        this.selectedCuentaSAP ="";
        this.selectedLocation ="";
        this.selectedDependencie ="";
        this.selectedVicepresidency="";
        this.selectedTax ="";
        this.taxprc = 0;
        this.solpedDet.taxvalor =0;

        /*this.descripcionReadOnly = false;
        this.itemCodeReadonly = false;
        this.acctcodeReadonly = false;*/

        

        /*if(this.solped.serie && this.solped.serie ==='SPB'){
          this.descripcionReadOnly = true;
          this.acctcodeReadonly = true;
        }*/
        
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

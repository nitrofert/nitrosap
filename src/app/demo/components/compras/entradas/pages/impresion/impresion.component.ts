import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-impresion',
  templateUrl: './impresion.component.html',
  styleUrls: ['./impresion.component.scss']
})
export class ImpresionComponent implements OnInit {

  idEntrada:any;
  logo!:string;
  nitEmpresa!:string;
  nombreEmpresa!:string;
  direccionEmpresa!:string;
  telefonoEmpresa!:string;

  proveedor:any ;
  encabezado:any ;
  detalle:any[]=[];
  userdoc:any;


  nit:string ="";
  ciudad:string = "";
  nombreProveedor:string = "";
  fechaDoc:string ="";
  noRef:string = "";
  attn:string = "";
  telefono:string = "";
  bodega:string = "";
  direccion:string = "";
  email:string = "";
  usuario:string = "";
  total:number =0;
  impuesto:number=0;
  comentario:string ="";
  tipodoc:string ="";
  espacio:number =210;
  labelTipoDoc:string ="ENTRADA DE MERCANCIA";
  footer:string ="";
  U_NF_PUNTAJE_HE:number =0;
  U_NF_CALIFICACION:string ="";


  constructor(private rutaActiva: ActivatedRoute,
              private comprasService: ComprasService,
              private authService: AuthService,) { }

  ngOnInit(): void {

    this.idEntrada = this.rutaActiva.snapshot.params;
    this.logo = this.authService.getInfoUsuario().logoempresa;
    this.nitEmpresa = this.authService.getInfoUsuario().nit;
    this.nombreEmpresa = this.authService.getInfoUsuario().companyname;
    this.direccionEmpresa = this.authService.getInfoUsuario().direccion;
    this.telefonoEmpresa = this.authService.getInfoUsuario().telefono;
    

    this.comprasService.impresionEntradaByIdSL(this.authService.getToken(),this.idEntrada.entrada)
        .subscribe({
          next:(infoEntrada)=>{
              console.log(infoEntrada);
              this.proveedor = infoEntrada.value[0].BusinessPartners;
              this.encabezado = infoEntrada.value[0].PurchaseDeliveryNotes;
              //this.detalle = infoEntrada.value[0]['PurchaseDeliveryNotes/DocumentLines'];
              
             
              this.userdoc = infoEntrada.value[0].Users;

              this.nit =this.proveedor.FederalTaxID;
              this.ciudad = this.proveedor.City;
              this.nombreProveedor = this.proveedor.CardName;
              this.fechaDoc =this.encabezado.DocDate;
              this.noRef = this.encabezado.NumAtCard;
              this.attn = this.proveedor.ContactPerson;
              this.telefono = this.proveedor.Phone1;
              //this.bodega = this.encabezado.;
              this.direccion = this.proveedor.MailAddress;
              this.email = this.proveedor.EmailAdddress;
              this.usuario = this.userdoc.UserName;
              this.total =this.encabezado.DocTotal;
              this.impuesto=this.encabezado.VatSum;
              this.comentario= this.encabezado.Comments;
              this.tipodoc = this.encabezado.DocType;
              this.footer = this.encabezado.ClosingRemarks;
              this.U_NF_PUNTAJE_HE = this.encabezado.U_NF_PUNTAJE_HE;
              this.U_NF_CALIFICACION = this.encabezado.U_NF_CALIFICACION;

              if(this.tipodoc=='S'){ 
                this.espacio = this.espacio  - 100;
                this.labelTipoDoc = "HOJA DE ENTRADA";
              }

              for(let linea of infoEntrada.value){
                this.detalle.push(linea['PurchaseDeliveryNotes/DocumentLines']);
                this.espacio = this.espacio  - 10;
              }
              console.log(this.detalle.length)

              console.log(this.proveedor,this.encabezado,this.detalle)
          },
          error:(err)=>{
              console.log(err);
          }
        });
  }

}

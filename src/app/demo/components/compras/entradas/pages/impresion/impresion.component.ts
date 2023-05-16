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

  headerPdf:any;
  footerPdf:any;
  contenidoPdf:any;
  marginBottom:number =0;
  infoPDF:any;

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
  DocCurrency:string="";


  constructor(private rutaActiva: ActivatedRoute,
              private comprasService: ComprasService,
              public authService: AuthService,) { }

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
              console.log(this.encabezado.DocCurrency);
              //this.detalle = infoEntrada.value[0]['PurchaseDeliveryNotes/DocumentLines'];
              
             
              this.userdoc = infoEntrada.value[0].Users;
              console.log(this.userdoc);

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
              this.usuario = this.userdoc.fullname==""?this.userdoc.UserName:this.userdoc.fullname;
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
              console.log(this.detalle)

              //console.log(this.proveedor,this.encabezado,this.detalle)
              this.setInfoPdf();
          },
          error:(err)=>{
              console.log(err);
          }
        });
  }

  setInfoPdf(){

    this.marginBottom =this.tipodoc==='S'?50:0;

    let newObjeto = Object.assign({}, this.detalle)

    console.log(newObjeto);

    this.infoPDF ={
      marginBottom: this.marginBottom,
      header:{
        nit:this.nitEmpresa,
        compania:this.nombreEmpresa,
        direccion:this.direccionEmpresa,
        telefono:this.telefonoEmpresa,
        tipodoc:this.labelTipoDoc,
        docnum:this.idEntrada.entrada,

      },
      content:{
        nit:this.nit==null?'':this.nit,
        ciudad:this.ciudad==null?'':this.ciudad,
        proveedor:this.nombreProveedor==null?'':this.nombreProveedor,
        fechadoc:this.fechaDoc==null?'':this.fechaDoc,
        noref:this.noRef==null?'':this.noRef,
        attn:this.attn==null?'':this.attn,
        telefono:this.telefono==null?'':this.telefono,
        direccion:this.direccion==null?'':this.direccion,
        email:this.email==null?'':this.email,
        U_NF_PUNTAJE_HE:this.U_NF_PUNTAJE_HE==null?'':this.U_NF_PUNTAJE_HE,
        U_NF_CALIFICACION:this.U_NF_CALIFICACION==null?'':this.U_NF_CALIFICACION=='E'?'Excelente':this.U_NF_CALIFICACION=='B'?'Bueno':'Regular',
        detalle:newObjeto,
        comentario:this.comentario==null?'':this.comentario,
        DocCurrency:this.encabezado.DocCurrency,
        subtotal:this.total - this.impuesto,
        iva:this.impuesto,
        total:this.total,
      },

    footer:{
      leyenda:this.tipodoc==='S'?`El día de hoy se reunieron en ${this.nombreEmpresa} S.A.S. el representante de la empresa ${this.nombreEmpresa} S.A.S. y el representante de la empresa ${this.proveedor.CardName} quienes tienen bajo su responsabilidad la ejecución de la presente obra y/o servicio, para hacer entrega y recibo de la obra y/o servicio descrito en la presente hoja de entrada. El proveedor declara que durante el servicio u obra prestada cumplió a cabalidad con el pago de las obligaciones laborales y prestaciones a su cargo, y por lo tanto se obliga a mantener indemne a ${this.nombreEmpresa} S.A.S. de cualquier reclamación judicial o extrajudicial que hicieren sus trabajadores o extrabajadores directamente al proveedor como empleador o exempleador o las entidades de seguridad social o por el pago de aportes parafiscales y por consiguiente asume todas las costas judiciales y extrajudiciales que demanden su defensa, incluyendo los honorarios de abogados, así como la totalidad del valor de la condena que eventualmente pudiere proferirse en su contra.`:'',
      comentario:this.footer==null?'':this.footer,
      usuario:this.usuario
    }

    }
    
  }

}

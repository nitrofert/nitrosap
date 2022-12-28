import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InfoUsuario } from 'src/app/demo/api/decodeToken';
import { AuthService } from 'src/app/demo/service/auth.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  @Input() infoPDF:any;
 
  

  infoUsuario!:InfoUsuario;
  logo64:string = '';


 

  constructor(private authService: AuthService) { }

  ngOnInit() {
    //Cargar informacion del usuario
    this.getInfoUsuario();
    
  }

  getInfoUsuario(){
    this.infoUsuario = this.authService.getInfoUsuario();
    this.authService.getLogoBase64()
    .subscribe({        
      next: (res) => {
        
        this.logo64 =res;
        //console.log(this.logo64);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createPDF(){
    console.log(this.infoPDF);

    let headersTable:any ={
      fila_0:{
        col1:{
          text:'ID',
          style:'subheader',
          alignment:'center',
          border: [false, false, false, true],
        },
        col2:{
          text:'Código',
          style:'subheader',
          alignment:'center',
          border: [false, false, false, true],
        },
        col3:{
          text:'Descripción',
          style:'subheader',
          alignment:'center',
          border: [false, false, false, true],
        },
        col4:{
          text:'Cantidad',
          style:'subheader',
          alignment:'right',
          border: [false, false, false, true],
        },
        col5:{
          text:'Precio Unitario',
          style:'subheader',
          alignment:'right',
          border: [false, false, false, true],
        },
        col6:{
          
          text:'Total',
          style:'subheader',
          alignment:'right',
          border: [false, false, false, true],
        }
      }
    };

    var body = [];
for (var key in headersTable){
    if (headersTable.hasOwnProperty(key)){
        var header = headersTable[key];
        var row = new Array();
        row.push( header.col1 );
        row.push( header.col2 );
        row.push( header.col3 );
        row.push( header.col4 );
        row.push( header.col5 );
        row.push( header.col6 );
        body.push(row);
    }
}

let rows = this.infoPDF.content.detalle;
let iterador = 1;
for (var key in rows) 
{
    if (rows.hasOwnProperty(key))
    {
        var data = rows[key];
        var row = new Array();
        row.push( { text:iterador.toString(),
                    fontSize:8,
                    alignment:'center',
                    border: [false, false, false, false]} );
        row.push( {text:data.ItemCode==null?'':data.ItemCode.toString(),
                    fontSize:8,
                    alignment:'center',
                    border: [false, false, false, false]}  );
        row.push( {text:data.ItemDescription.toString(),
                    fontSize:8,
                    alignment:'center',
                    border: [false, false, false, false]} );
        row.push( {text:data.Quantity.toString(),
                    fontSize:8,
                    alignment:'right',
                    border: [false, false, false, false]}  );
        row.push( {text:data.Price.toString(),
                    fontSize:8,
                    alignment:'right',
                    border: [false, false, false, false]} );
        row.push( {text:data.LineTotal.toString(),
                    fontSize:8,
                    alignment:'right',
                    border: [false, false, false, false]} );
        //console.log(row);
        body.push(row);
    }
    iterador++;
}
    const pdfDefinition:any = {
      
      // a string or { width: number, height: number }
      pageSize: 'LETTER',

      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      
      pageMargins: [40, 80, 40, (100+this.infoPDF.marginBottom)],
      header: {
        margin: 8,
        columns: [
            {
              margin:[20,0,30,0],
                table: {
                    widths: [ '35%','35%','30%'],
                   
                    body: [
                      [
                        {
                          //Columna Logo
                          margin:[0,8,0,0],
                          image:'Logo',
                          fit:[150,150],
                          alignment:'center'
                        },
                        //Columna Datos compañia
                        [
                          
                          {
                            table: {
                              body: [
                                [`${this.infoPDF.header.compania}`],
                                [`Nit: ${this.infoPDF.header.nit}`],
                                [`${this.infoPDF.header.direccion}`],
                                [`Tel.: ${this.infoPDF.header.telefono}`]
                              ]
                            },
                            alignment:'center',
                            fontSize:8,
                            layout: 'noBorders'
                          }
                        ],
                        //Columna Número Hoja de Entrada o Entrada mercancia
                        [
                          
                          {
                            table: {
                              widths: [ '10%','90%'],
                              body: [
                                [{
                                    border: [false, false, false, false],  
                                    text:`${this.infoPDF.header.tipodoc}`, 
                                    colSpan:2, 
                                    rowSpan:2,
                                    alignment:'center',
                                    fontSize:16,
                                    blod:true,
                                    color:'#757575'
                                  },
                                  {}
                                ],
                                ['',''],
                                [{
                                    border: [true, true, true, true],
                                    text:'No.', 
                                    rowSpan:2,
                                    alignment:'center',
                                    
                                  },
                                  {
                                    border: [true, true, true, true],
                                    text:`${this.infoPDF.header.docnum}`, 
                                    rowSpan:2,
                                    alignment:'center',
                                    
                                  },
                                ],
                                ['','']
                              ]
                            },
                            alignment:'center',
                            fontSize:8,
                            //layout: 'noBorders',
                            margin: [0,8,0,0]
                          }
                        ],
                      ],
                      
                    ]
                },
                layout: 'noBorders'
            }

        ]
    },
    

    content:[
     {
      table:{
        widths: [ '100%' ],
        body:[
          [
            {
             
              table:{
                
                body:[
                  [
                    {
                     
                      
                      text:'Proveedor', 
                      alignment:'left',
                      fillColor: '#eeeeee',
                    }
                  ],
                  
                ]
              },
              border: [true, true, true, false],
            },
           
          ],
          //Informacion del proveedor
          [
            {
              table:{
               
                
                widths: [ '10%','1%','35%','13%','1%','19%','9%','12%' ],
                body:[
                  [
                    {
                      text:'NIT',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.nit}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'CIUDAD',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      colSpan:3,
                      text:`${this.infoPDF.content.ciudad}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'',
                      

                    },
                    {
                      text:'', 
                      
                    }
                  ],
                  [
                    {
                      text:'SEÑORES',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.proveedor}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'F.DOCUMENTO',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      
                      text:`${this.infoPDF.content.fechadoc}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'N° Ref:',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],

                    },
                    {
                      text:`${this.infoPDF.content.noref}`, 
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    }
                  ],
                  [
                    {
                      text:'Attn.',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.attn}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'TELEFONO',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      
                      text:`${this.infoPDF.content.telefono}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'Bodega:',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],

                    },
                    {
                      text:'', 
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    }
                  ],
                  [
                    {
                      text:'DIRECCION',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.direccion}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'EMAIL',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      colSpan:3,
                      text:`${this.infoPDF.content.email}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'',
               

                    },
                    {
                      text:'', 
             
                    }
                  ],
                  [
                    {
                      text:'PUNTAJE',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.U_NF_PUNTAJE_HE}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'CALIFICACIÓN',
                      style:'subheader',
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:':',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      colSpan:3,
                      text:`${this.infoPDF.content.U_NF_CALIFICACION}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'',
               

                    },
                    {
                      text:'', 
             
                    }
                  ],
                ]
                
              },
              border: [true, false, true, true],
            }
          ],
          //Tabla detalle etrada
          [
            {
              table:{
               
                
                widths: [ '5%','15%','35%','15%','15%','15%' ],
                body:/*[
                  //Cabecera detalle
                  [
                    {
                      text:'ID',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, true],
                    },
                    {
                      text:'Código',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, true],
                    },
                    {
                      text:'Descripción',
                      style:'subheader',
                      alignment:'center',
                      border: [false, false, false, true],
                    },
                    {
                      text:'Cantidad',
                      style:'subheader',
                      alignment:'right',
                      border: [false, false, false, true],
                    },
                    {
                      text:'Precio Unitario',
                      style:'subheader',
                      alignment:'right',
                      border: [false, false, false, true],
                    },
                    {
                      
                      text:'Total',
                      style:'subheader',
                      alignment:'right',
                      border: [false, false, false, true],
                    }
                  ],
                  //Detalle entrada
                  ,
                  [
                    {
                      text:'ID',
                      fontSize:8,
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:'Código',
                      fontSize:8,
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:'Descripción',
                      fontSize:8,
                      alignment:'center',
                      border: [false, false, false, false],
                    },
                    {
                      text:'Cantidad',
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                    {
                      text:'Precio Unitario',
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                    {
                      
                      text:'Total',
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    }
                  ]
                ]*/ body
                
              },
              border: [true, false, true, true],
            }
          ]
          
        ]
      },
        
     },
     //Sumario total entrada
     {
      margin:[0,10,0,0],
      table:{
        
        widths: [ '100%' ],
        body:[
          [
            {
             
              table:{
                
                body:[
                  [
                    {
                     
                      
                      text:'Observaciones', 
                      alignment:'left',
                      fillColor: '#eeeeee',
                    }
                  ],
                  
                ]
              },
              border: [true, true, true, false],
            },
           
          ],
          [
            {
              table:{
               
                
                widths: [ '70%','15%','15%' ],
                body:[
                  
                  [
                    {
                      rowSpan:3,
                      text:`${this.infoPDF.content.comentario}`,
                      fontSize:8,
                      alignment:'left',
                      border: [false, false, false, false],
                    },
                    {
                      text:'SUBTOTAL:',
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.subtotal}`,
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                   
                  
                  ],
                  [
                    {
                      
                      text:'',
                      
                    },
                    {
                      text:'IVA:',
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.iva}`,
                      fontSize:8,
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                   
                  
                  ],
                  [
                    {
                      
                      text:'',
                      
                    },
                    {
                      text:'TOTAL:',
                      style:'subheader',
                      alignment:'right',
                      border: [false, false, false, false],
                    },
                    {
                      text:`${this.infoPDF.content.total}`,
                      style:'subheader',
                      alignment:'right',
                      border: [false, true, false, false],
                    },
                   
                  
                  ],
                ]
                
              },
              border: [true, false, true, true],
            }
          ],
         
          
        ]
      },
        
     }
     
    ],

    footer:{
      
      margin: 8,
      //height:170,
      columns: 
        [
           {
            margin:[20,0,30,0],
              table: {
                widths: [ '33%','34%','33%'],
                body: [
                  [ {
                    //comentario para entradas de tipo servicio
                    margin:[2,0,2,5],
                    colSpan:3,
                    border: [false, false, false, false],  
                    text:`${this.infoPDF.footer.leyenda}`, 
                    alignment:'justify',
                    style: ['quote', 'small']
                    
                    //height:50
                    
                  },
                  { text:''},
                  { text:''}
                ],
                    [ {
                      //comentario de entrada footer
                      margin:[2,0,2,5],
                      colSpan:3,
                      border: [false, false, false, false],  
                      text:`${this.infoPDF.footer.comentario}`, 
                      alignment:'justify',
                      style: ['quote', 'small']
                      
                      //height:50
                      
                    },
                    { text:''},
                    { text:''}
                  ],
                  [ {
                      margin:[2,0,2,0],
                      colSpan:3,
                      //border: [false, true, false, true],  
                      text:'Firmas', 
                      alignment:'left',
                      fillColor: '#eeeeee',
                      //height:50
                      
                    },
                    { text:''},
                    { text:''}
                  ],
                  [{
                      margin:[2,10,2,0],
                      border: [false, false, false, true],  
                      text:`${this.infoPDF.footer.usuario}`, 
                      
                    },
                    {
                      border: [false, false, false, true],  
                      text:'', 
                      margin:[2,0,2,0]
                    },
                    {
                      border: [false, false, false, true],  
                      text:'', 
                      margin:[2,0,2,0]
                    }
                  ],
                  [{
                    border: [false, true, false, false],  
                    text:'REALIZADO POR', 
                    margin:[2,0,2,0]
                    },
                    {
                      border: [false, true, false, false],  
                      text:'RECIBE',
                      margin:[2,0,2,0] 
                    },
                    {
                      border: [false, true, false, false],  
                      text:'PROVEEDOR', 
                      margin:[2,0,2,0]
                    }
                ]
                ]
                
              },
              alignment:'center',
              fontSize:8,
              //layout: 'noBorders',
              //margin: [0,8,0,0]
            },

            
      ]
    },
    
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 8,
        bold: true
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 7
      },
      hide:{
        display: 'none'
      }
    },
    
    images: {
        Logo: this.logo64,
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

}

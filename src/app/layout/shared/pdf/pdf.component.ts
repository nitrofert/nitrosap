import { Component, OnInit } from '@angular/core';
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
        console.log(this.logo64);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createPDF(){
    const pdfDefinition:any = {
      
      // a string or { width: number, height: number }
      pageSize: 'LETTER',

      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      
      pageMargins: [40, 80, 40, 150],
      header: {
        margin: 8,
        columns: [
            {

                table: {
                    widths: [ '40%','35%','25%'],

                    body: [
                      [
                        {
                          margin:[0,8,0,0],
                          image:'Logo',
                          fit:[150,150],
                          alignment:'center'
                        },
                        [
                          
                          {
                            table: {
                              body: [
                                ['NITROCARIBE'],
                                ['Nit: 901594213-9'],
                                ['ZF SANTA MARTA 6 7 8 Y 10 P A KM 1 VIA GAIRA SEC LA LUCHA'],
                                ['Tel.: 3102110578']
                              ]
                            },
                            alignment:'center',
                            fontSize:8,
                            layout: 'noBorders'
                          }
                        ],
                        [
                          
                          {
                            table: {
                              widths: [ '10%','90%'],
                              body: [
                                [{
                                    border: [false, false, false, false],  
                                    text:'HOJA DE ENTRADA', 
                                    colSpan:2, 
                                    rowSpan:2,
                                    alignment:'center',
                                    fontSize:14,
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
                                    text:'68000012', 
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
                      ]
                    ]
                },
                layout: 'noBorders'
            }

        ]
    },
    content: [
        
       
    ],

    footer:{
      
      margin: 8,
      //height:170,
      columns: 
        [
           {
      
              table: {
                widths: [ '33%','34%','33%'],
                body: [
                  [ {
                    //comentario para entradas de tipo servicio
                    margin:[2,0,2,5],
                    colSpan:3,
                    border: [false, false, false, false],  
                    text:`El día de hoy se reunieron en Intefert S.A.S. el representante de la empresa Intefert S.A.S. y el representante de la empresa GRUPO EMPRESARIAL SATIBALTI SAS quienes tienen bajo su responsabilidad la ejecución de la presente obra y/o servicio, para hacer entrega y recibo de la obra y/o servicio descrito en la presente hoja de entrada.
                    El proveedor declara que durante el servicio u obra prestada cumplió a cabalidad con el pago de las obligaciones laborales y prestaciones a su cargo, y por lo tanto se obliga a mantener indemne a Intefert S.A.S. de cualquier reclamación judicial o extrajudicial que hicieren sus trabajadores o extrabajadores directamente al proveedor como empleador o exempleador o las entidades de seguridad social o por el pago de aportes parafiscales y por consiguiente asume todas las costas judiciales y extrajudiciales que demanden su defensa, incluyendo los honorarios de abogados, así como la totalidad del valor de la condena que eventualmente pudiere proferirse en su contra`, 
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
                      text:'comentario de entrada footer SAP', 
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
                      text:'Nombre autor', 
                      
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
              margin: [0,8,0,0]
            },

            
      ]
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 7
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

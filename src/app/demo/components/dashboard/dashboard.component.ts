import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ComprasService } from '../../service/compras.service';
import { SAPService } from '../../service/sap.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService, ConfirmationService],
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;
    infoUsuario: any;
 
    perfilesUsuario: any;
    permisosUsuario: any;
   
    urlBreadCrumb!: string;
    permisosUsuarioPagina: any;

    mostrarDashboardGS:boolean = false;
    mostrarDashboardAS:boolean = false;
    mostrarDashboardAC:boolean = false;

    /*constructor(private productService: ProductService, public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }*/

    constructor(private rutaActiva: ActivatedRoute,
        private comprasService:ComprasService,
        private router:Router,
        private confirmationService: ConfirmationService, 
        private messageService: MessageService,
        public authService: AuthService,
        private sapService:SAPService) { }

    ngOnInit() {
        /*this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];*/

        //Cargar informacion del usuario
        this.getInfoUsuario();
        //Cargar perfiles del usuario
        this.getPerfilesUsuario();
        //Cargar permisos del usuario
        this.getPermisosUsuario();
        //Cargar permisos usuario pagina
        this.getPermisosUsuarioPagina();
        //Cargar Dasboard por perfil
        this.mostarDashboards();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


    getInfoUsuario(){
        this.infoUsuario = this.authService.getInfoUsuario();
      }
    
      getPerfilesUsuario(){
        this.perfilesUsuario = this.authService.getPerfilesUsuario();
        //console.log(this.perfilesUsuario);
      }
    
      getPermisosUsuario(){
        this.permisosUsuario = this.authService.getPermisosUsuario();
      }
    
      getPermisosUsuarioPagina(){
        let url ="";
        //console.log("URL origen",this.router.url);
        //console.log("URL params",this.rutaActiva.snapshot.params['solped']);
        if(this.rutaActiva.snapshot.params['entrada']){
          let entradaSeleccionada = this.rutaActiva.snapshot.params;
          if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
            url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
          }
          //console.log("URL con parametros: ",url);
        }else{
          url= this.router.url;
          //console.log("URL sin parametros: ",url);
        }
        this.urlBreadCrumb = url;
        this.permisosUsuarioPagina = this.permisosUsuario.filter((item: { url: string; }) => item.url===url);
        //console.log(this.permisosUsuario,this.permisosUsuarioPagina);
      }

      mostarDashboards(){
        for(let perfil of this.perfilesUsuario){

            if(perfil.perfil ==='Analista de compras'){
                this.mostrarDashboardAC = true;
            }
            if(perfil.perfil ==='Generador solicitud'){
                this.mostrarDashboardGS = true;
            }
            if(perfil.perfil ==='Aprobador Solicitud'){
                this.mostrarDashboardAS = true;
            }
        }
      }
    
}

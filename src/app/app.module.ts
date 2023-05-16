/***** Modulos angular *************/
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import localeES_CO from '@angular/common/locales/es-CO';
import {registerLocaleData} from '@angular/common';

/**********Componentes ********************/
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';

/********** Servicios ********************/
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';




//Provider
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';




export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

registerLocaleData(localeES_CO);

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, 
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        RecaptchaV3Module

    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue:'es-CO'},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,
        {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
        JwtHelperService,
        
            
            {
              provide: RECAPTCHA_V3_SITE_KEY,
              useValue:  environment.key_recaptcha,
               
            },
          
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

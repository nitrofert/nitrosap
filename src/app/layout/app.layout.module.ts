/***** Modulos angular *************/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/**********Componentes ********************/
import { AppMenuitemComponent } from './shared/menuitem/app.menuitem.component';
import { AppTopBarComponent } from './shared/topbar/app.topbar.component';
import { AppFooterComponent } from './shared/footer/app.footer.component';
import { AppSidebarComponent } from "./shared/sidebar/app.sidebar.component";
import { AppLayoutComponent } from './app.layout.component';
import { AppMenuComponent } from './shared/menu/app.menu.component';

/************ modulos personalizados  *******************/
import { AppConfigModule } from './config/config.module';
import { PrimengModule } from './shared/primeng/primeng.module';




@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        //InputTextModule,
        //SidebarModule,
        //BadgeModule,
        //RadioButtonModule,
        //InputSwitchModule,
        //RippleModule,
        RouterModule,
        AppConfigModule,
        //MenuModule,
        //TooltipModule
        PrimengModule
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }

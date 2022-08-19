import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { EditarMenuComponent } from './pages/editar-menu/editar-menu.component';
import { NuevoMenuComponent } from './pages/nuevo-menu/nuevo-menu.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MenuComponent },
        { path: 'nuevo', component: NuevoMenuComponent },
        { path: 'editar/:menu', component: EditarMenuComponent }
    ])],
    exports: [RouterModule]
})
export class MenuRoutingModule { }

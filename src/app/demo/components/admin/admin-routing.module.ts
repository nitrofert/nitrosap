import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
        { path: 'perfiles', loadChildren: () => import('./perfiles/perfiles.module').then(m => m.PerfilesModule) },
        { path: 'permisos', loadChildren: () => import('./permisos/permisos.module').then(m => m.PermisosModule) },
        { path: 'empresas', loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule) },
        { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) },
        { path: 'dependencias', loadChildren: () => import('./dependencias/dependencias.module').then(m => m.DependenciasModule) },
        { path: 'cuentas', loadChildren: () => import('./cuentas/cuentas.module').then(m => m.CuentasModule) },
        { path: 'cuentas-dependencia', loadChildren: () => import('./cuentas-dependencia/cuentas-dependencia.module').then(m => m.CuentasDependenciaModule) }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

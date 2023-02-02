import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './demo/components/auth/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { LoggedInGuard } from './guard/logged-in.guard';
import { RoleAccesGuard } from './guard/role-acces.guard';
import { TestMailComponent } from './demo/components/compras/solped/pages/test-mail/test-mail.component';
import { RechazoSolpedComponent } from './demo/components/compras/solped/pages/rechazo-solped/rechazo-solped.component';
import { ResponseApprovedComponent } from './demo/components/compras/solped/pages/response-approved/response-approved.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: LoginComponent, canActivate:[LoggedInGuard], loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            {
                path: 'portal', component: AppLayoutComponent, canActivate:[AuthGuard],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'admin',canActivate:[RoleAccesGuard], data:{expectedRole:'Administrador'}, loadChildren: () => import('./demo/components/admin/admin.module').then(m => m.AdminModule) },
                    { path: 'compras',  loadChildren: () => import('./demo/components/compras/compras.module').then(m => m.ComprasModule) },
                    { path: 'perfil',  loadChildren: () => import('./demo/components/auth/user/user.module').then(m => m.UserModule) },
                ],
            },
            //{ path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            //{ path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'reject/solped/:crypt', component: RechazoSolpedComponent },
            { path: 'mensaje/solped/:crypt/:message', component: ResponseApprovedComponent },
            { path: 'pages/notfound', component: NotfoundComponent },
            
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

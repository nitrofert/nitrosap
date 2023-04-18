"use strict";(self.webpackChunksakai=self.webpackChunksakai||[]).push([[650],{2650:(Y,h,s)=>{s.r(h),s.d(h,{DashboardModule:()=>i});var m=s(6895),f=s(4006),l=s(9335),u=s(805),r=s(4650),p=s(4931),g=s(1562),b=s(1922);function v(a,o){1&a&&(r.TgZ(0,"div"),r._uU(1," Dashboard Generador Solped "),r.qZA())}function D(a,o){1&a&&(r.TgZ(0,"div"),r._uU(1," Dashboard Analista de Compra "),r.qZA())}function y(a,o){1&a&&(r.TgZ(0,"div"),r._uU(1," Dashboard Aprobador Solped "),r.qZA())}class n{constructor(o,t,d,c,U,A,P){this.rutaActiva=o,this.comprasService=t,this.router=d,this.confirmationService=c,this.messageService=U,this.authService=A,this.sapService=P,this.mostrarDashboardGS=!1,this.mostrarDashboardAS=!1,this.mostrarDashboardAC=!1}ngOnInit(){this.getInfoUsuario(),this.getPerfilesUsuario(),this.getPermisosUsuario(),this.getPermisosUsuarioPagina(),this.mostarDashboards()}initChart(){const o=getComputedStyle(document.documentElement),t=o.getPropertyValue("--text-color"),d=o.getPropertyValue("--text-color-secondary"),c=o.getPropertyValue("--surface-border");this.chartData={labels:["January","February","March","April","May","June","July"],datasets:[{label:"First Dataset",data:[65,59,80,81,56,55,40],fill:!1,backgroundColor:o.getPropertyValue("--bluegray-700"),borderColor:o.getPropertyValue("--bluegray-700"),tension:.4},{label:"Second Dataset",data:[28,48,40,19,86,27,90],fill:!1,backgroundColor:o.getPropertyValue("--green-600"),borderColor:o.getPropertyValue("--green-600"),tension:.4}]},this.chartOptions={plugins:{legend:{labels:{color:t}}},scales:{x:{ticks:{color:d},grid:{color:c,drawBorder:!1}},y:{ticks:{color:d},grid:{color:c,drawBorder:!1}}}}}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}getInfoUsuario(){this.infoUsuario=this.authService.getInfoUsuario()}getPerfilesUsuario(){this.perfilesUsuario=this.authService.getPerfilesUsuario(),console.log(this.perfilesUsuario)}getPermisosUsuario(){this.permisosUsuario=this.authService.getPermisosUsuario()}getPermisosUsuarioPagina(){let o="";if(this.rutaActiva.snapshot.params.entrada){let t=this.rutaActiva.snapshot.params;this.router.url.indexOf("/"+t.entrada)>=0&&(o=this.router.url.substring(0,this.router.url.indexOf("/"+t.entrada)))}else o=this.router.url;this.urlBreadCrumb=o,this.permisosUsuarioPagina=this.permisosUsuario.filter(t=>t.url===o)}mostarDashboards(){for(let o of this.perfilesUsuario)"Analista de compras"===o.perfil&&(this.mostrarDashboardAC=!0),"Generador solicitud"===o.perfil&&(this.mostrarDashboardGS=!0),"Aprobador Solicitud"===o.perfil&&(this.mostrarDashboardAS=!0)}}n.\u0275fac=function(o){return new(o||n)(r.Y36(l.gz),r.Y36(p.K),r.Y36(l.F0),r.Y36(u.YP),r.Y36(u.ez),r.Y36(g.e),r.Y36(b.c))},n.\u0275cmp=r.Xpm({type:n,selectors:[["ng-component"]],features:[r._Bn([u.ez,u.YP])],decls:4,vars:3,consts:[[1,"grid"],[4,"ngIf"]],template:function(o,t){1&o&&(r.TgZ(0,"div",0),r.YNc(1,v,2,0,"div",1),r.YNc(2,D,2,0,"div",1),r.YNc(3,y,2,0,"div",1),r.qZA()),2&o&&(r.xp6(1),r.Q6J("ngIf",t.mostrarDashboardGS),r.xp6(1),r.Q6J("ngIf",t.mostrarDashboardAC),r.xp6(1),r.Q6J("ngIf",t.mostrarDashboardAS))},dependencies:[m.O5],encapsulation:2});class e{}e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=r.oAB({type:e}),e.\u0275inj=r.cJS({imports:[l.Bz.forChild([{path:"",component:n}]),l.Bz]});var S=s(931),C=s(3837);class i{}i.\u0275fac=function(o){return new(o||i)},i.\u0275mod=r.oAB({type:i}),i.\u0275inj=r.cJS({imports:[m.ez,f.u5,e,S.W,C.S]})}}]);
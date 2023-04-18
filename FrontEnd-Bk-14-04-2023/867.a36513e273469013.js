"use strict";(self.webpackChunksakai=self.webpackChunksakai||[]).push([[867],{3867:(I,q,l)=>{l.r(q),l.d(q,{EmpresasModule:()=>m});var y=l(6895),i=l(4006),_=l(9335),p=l(805),e=l(4650),C=l(9701),v=l(1562),b=l(5593),f=l(1740),Z=l(99);const A=["filter"];function E(a,n){if(1&a){const t=e.EpF();e.TgZ(0,"div",10)(1,"button",11),e.NdJ("click",function(){e.CHM(t);const s=e.oxw(),T=e.MAs(4);return e.KtG(s.clear(T))}),e.qZA(),e.TgZ(2,"button",12),e.NdJ("click",function(){e.CHM(t);const s=e.oxw();return e.KtG(s.newCompany())}),e.qZA(),e.TgZ(3,"button",13),e.NdJ("click",function(){e.CHM(t);const s=e.oxw();return e.KtG(s.editCompany())}),e.qZA(),e.TgZ(4,"span",14),e._UZ(5,"i",15),e.TgZ(6,"input",16,17),e.NdJ("input",function(s){e.CHM(t);const T=e.oxw(),Q=e.MAs(4);return e.KtG(T.onGlobalFilter(Q,s))}),e.qZA()()()}if(2&a){const t=e.oxw();e.xp6(3),e.Q6J("disabled",!t.selectedCompany||1!=t.selectedCompany.length)}}function J(a,n){1&a&&(e.TgZ(0,"tr"),e._UZ(1,"th",18),e.TgZ(2,"th")(3,"div",19),e._uU(4," Empresa "),e._UZ(5,"p-columnFilter",20),e.qZA()(),e.TgZ(6,"th")(7,"div",19),e._uU(8," Estado "),e._UZ(9,"p-columnFilter",21),e.qZA()(),e.TgZ(10,"th")(11,"div",19),e._uU(12," Logo "),e.qZA()(),e.TgZ(13,"th")(14,"div",19),e._uU(15," BD Mysql "),e._UZ(16,"p-columnFilter",22),e.qZA()(),e.TgZ(17,"th")(18,"div",19),e._uU(19," BD SAP "),e._UZ(20,"p-columnFilter",23),e.qZA()(),e.TgZ(21,"th")(22,"div",19),e._uU(23," URL webservice SAP "),e._UZ(24,"p-columnFilter",24),e.qZA()()())}function N(a,n){if(1&a&&e._UZ(0,"img",28),2&a){const t=e.oxw().$implicit;e.s9C("src",t.logoempresa,e.LSH),e.s9C("alt",t.logoempresa),e.s9C("title",t.logoempresa)}}function F(a,n){if(1&a&&(e.TgZ(0,"tr")(1,"td"),e._UZ(2,"p-tableCheckbox",25),e.qZA(),e.TgZ(3,"td",26),e._uU(4),e.qZA(),e.TgZ(5,"td",26),e._uU(6),e.qZA(),e.TgZ(7,"td",26),e.YNc(8,N,1,3,"img",27),e.qZA(),e.TgZ(9,"td",26),e._uU(10),e.qZA(),e.TgZ(11,"td",26),e._uU(12),e.qZA(),e.TgZ(13,"td",26),e._uU(14),e.qZA()()),2&a){const t=n.$implicit;e.xp6(2),e.Q6J("value",t),e.xp6(2),e.hij(" ",t.companyname," "),e.xp6(2),e.hij(" ",t.status," "),e.xp6(2),e.Q6J("ngIf",""!=t.logoempresa),e.xp6(2),e.hij(" ",t.urlwsmysql," "),e.xp6(2),e.hij(" ",t.dbcompanysap," "),e.xp6(2),e.hij(" ",t.urlwssap," ")}}function U(a,n){1&a&&(e.TgZ(0,"tr")(1,"td",29),e._uU(2,"No se econtraron empresas."),e.qZA()())}function B(a,n){1&a&&(e.TgZ(0,"tr")(1,"td",29),e._uU(2,"Cargando empresas. Por favor espere"),e.qZA()())}const S=function(){return["companyname","status","urlwsmysql","dbcompanysap"]};class u{constructor(n,t,o){this.adminService=n,this.router=t,this.authService=o,this.company=[],this.loading=!0,this.selectedCompany=[]}ngOnInit(){this.adminService.listCompanies(this.authService.getToken()).subscribe({next:n=>{this.loading=!1,this.company=n},error:n=>{console.error(n)}})}newCompany(){this.router.navigate(["/portal/admin/empresas/nuevo"])}editCompany(){this.router.navigate(["/portal/admin/empresas/editar",this.selectedCompany[0].id])}formatCurrency(n){return n.toLocaleString("en-US",{style:"currency",currency:"USD"})}onGlobalFilter(n,t){n.filterGlobal(t.target.value,"contains")}clear(n){n.clear(),this.filter.nativeElement.value=""}}u.\u0275fac=function(n){return new(n||u)(e.Y36(C.l),e.Y36(_.F0),e.Y36(v.e))},u.\u0275cmp=e.Xpm({type:u,selectors:[["app-empresas"]],viewQuery:function(n,t){if(1&n&&e.Gf(A,5),2&n){let o;e.iGM(o=e.CRH())&&(t.filter=o.first)}},features:[e._Bn([p.ez,p.YP])],decls:10,vars:8,consts:[[1,"grid"],[1,"col-12"],[1,"card"],["dataKey","id","styleClass","p-datatable-gridlines","selectionMode","single","responsiveLayout","scroll",3,"value","rows","loading","rowHover","paginator","globalFilterFields","selection","selectionChange"],["dt1",""],["pTemplate","caption"],["pTemplate","header"],["pTemplate","body"],["pTemplate","emptymessage"],["pTemplate","loadingbody"],[1,"flex","justify-content-between","flex-column","sm:flex-row"],["pButton","","label","Limpiar","icon","pi pi-filter-slash",1,"p-button-outlined","mb-2",3,"click"],["pButton","","label","Nuevo","icon","pi pi-plus",1,"p-button-outlined","mb-2","p-button-success",3,"click"],["pButton","","label","Editar","icon","pi pi-pencil",1,"p-button-outlined","mb-2","p-button-secondary",3,"disabled","click"],[1,"p-input-icon-left","mb-2"],[1,"pi","pi-search"],["pInputText","","type","text","placeholder","Buscar por palabra clave",1,"w-full",3,"input"],["filter",""],[2,"width","3rem"],[1,"flex","justify-content-between","align-items-center"],["type","text","field","companyname","display","menu","placeholder","Buscar por empresa"],["type","text","field","status","display","menu","placeholder","Buscar por estado"],["type","text","field","urlwsmysql","display","menu","placeholder","Buscar por BD mysql"],["type","text","field","dbcompanysap","display","menu","placeholder","Buscar por BD SAP"],["type","text","field","urlwssap","display","menu","placeholder","Buscar por BD SAP"],[3,"value"],[2,"min-width","12rem"],["style","height: 40px;",3,"src","alt","title",4,"ngIf"],[2,"height","40px",3,"src","alt","title"],["colspan","7"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-table",3,4),e.NdJ("selectionChange",function(s){return t.selectedCompany=s}),e.YNc(5,E,8,1,"ng-template",5),e.YNc(6,J,25,0,"ng-template",6),e.YNc(7,F,15,7,"ng-template",7),e.YNc(8,U,3,0,"ng-template",8),e.YNc(9,B,3,0,"ng-template",9),e.qZA()()()()),2&n&&(e.xp6(3),e.Q6J("value",t.company)("rows",10)("loading",t.loading)("rowHover",!0)("paginator",!0)("globalFilterFields",e.DdM(7,S))("selection",t.selectedCompany))},dependencies:[y.O5,p.jx,b.Hq,f.o,Z.iA,Z.UA,Z.xl],styles:["[_nghost-%COMP%]     .p-frozen-column{font-weight:700}[_nghost-%COMP%]     .p-datatable-frozen-tbody{font-weight:700}[_nghost-%COMP%]     .p-progressbar{height:.5rem}"]});var M=l(2210),w=l(7772);const d=function(a){return{"ng-invalid ng-dirty":a}};class c{constructor(n,t,o){this.rutaActiva=n,this.adminService=t,this.authService=o,this.companyname="",this.status="",this.urlwsmysql="",this.logoempresa="",this.urlwssap="",this.dbcompanysap="",this.submitted=!1,this.messageForm=[],this.submitBotton=!1,this.estados=[{name:"Activo",code:"A"},{name:"Inactivo",code:"I"}]}ngOnInit(){this.companySelected=this.rutaActiva.snapshot.params,this.adminService.getCompanyById(this.authService.getToken(),this.companySelected.company).subscribe({next:n=>{this.companyname=n[0].companyname,this.status=n[0].status,this.logoempresa=n[0].logoempresa,this.urlwsmysql=n[0].urlwsmysql,this.urlwssap=n[0].urlwssap||"",this.dbcompanysap=n[0].dbcompanysap||""},error:n=>{this.submitBotton=!1,console.error(n)}})}saveCompany(){if(this.submitted=!0,this.companyname&&this.urlwsmysql&&this.urlwssap&&this.status&&this.dbcompanysap){this.submitBotton=!0;const n={id:this.companySelected.company,companyname:this.companyname,status:this.status,logoempresa:this.logoempresa,urlwsmysql:this.urlwsmysql,urlwssap:this.urlwssap,dbcompanysap:this.dbcompanysap};this.adminService.updateCompany(this.authService.getToken(),n).subscribe({next:t=>{this.messageForm=[{severity:"success",summary:"!Genial\xa1",detail:`Ha actualizado la empresa ${this.companyname}`,life:3e3}]},error:t=>{this.submitBotton=!1,console.error(t)}})}else this.messageForm=[{severity:"error",summary:"!Opps\xa1",detail:"Debe diligenciar los campos resaltados en rojo",life:3e3}]}clear(){this.submitBotton=!1,this.companyname="",this.status="",this.logoempresa="",this.urlwsmysql="",this.urlwssap="",this.dbcompanysap=""}}c.\u0275fac=function(n){return new(n||c)(e.Y36(_.gz),e.Y36(C.l),e.Y36(v.e))},c.\u0275cmp=e.Xpm({type:c,selectors:[["app-editar-empresa"]],features:[e._Bn([p.ez])],decls:33,vars:24,consts:[[1,"grid"],[1,"col-12","md:col-6","col-offset-3"],[1,"card","p-fluid"],[3,"value","valueChange"],[1,"field"],["htmlFor","companyname"],["pInputText","","id","companyname","name","companyname","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","status"],["optionLabel","name","optionValue","code","id","status","name","status","placeholder","Seleccione el estado",3,"options","ngModel","required","ngClass","ngModelChange"],["htmlFor","logoempresa"],["pInputText","","id","logoempresa","name","logoempresa","type","text",3,"ngModel","ngModelChange"],["htmlFor","urlwsmysql"],["pInputText","","id","urlwsmysql","name","urlwsmysql","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","dbcompanysap"],["pInputText","","id","dbcompanysap","name","dbcompanysap","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","urlwssap"],["pInputText","","id","urlwssap","name","urlwssap","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],[1,"col"],["pButton","","label","Guardar","icon","pi pi-save",1,"p-button-outlined","mb-2","p-button-success",3,"click"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-messages",3),e.NdJ("valueChange",function(s){return t.messageForm=s}),e.qZA(),e.TgZ(4,"h5"),e._uU(5,"Editar empresa"),e.qZA(),e.TgZ(6,"div",4)(7,"label",5),e._uU(8,"Empresa"),e.qZA(),e.TgZ(9,"input",6),e.NdJ("ngModelChange",function(s){return t.companyname=s}),e.qZA()(),e.TgZ(10,"div",4)(11,"label",7),e._uU(12,"Estado"),e.qZA(),e.TgZ(13,"p-dropdown",8),e.NdJ("ngModelChange",function(s){return t.status=s}),e.qZA()(),e.TgZ(14,"div",4)(15,"label",9),e._uU(16,"Logo"),e.qZA(),e.TgZ(17,"input",10),e.NdJ("ngModelChange",function(s){return t.logoempresa=s}),e.qZA()(),e.TgZ(18,"div",4)(19,"label",11),e._uU(20,"BD MySQL"),e.qZA(),e.TgZ(21,"input",12),e.NdJ("ngModelChange",function(s){return t.urlwsmysql=s}),e.qZA()(),e.TgZ(22,"div",4)(23,"label",13),e._uU(24,"BD SAP"),e.qZA(),e.TgZ(25,"input",14),e.NdJ("ngModelChange",function(s){return t.dbcompanysap=s}),e.qZA()(),e.TgZ(26,"div",4)(27,"label",15),e._uU(28,"URL Webservice SAP"),e.qZA(),e.TgZ(29,"input",16),e.NdJ("ngModelChange",function(s){return t.urlwssap=s}),e.qZA()(),e.TgZ(30,"div",0)(31,"div",17)(32,"button",18),e.NdJ("click",function(){return t.saveCompany()}),e.qZA()()()()()()),2&n&&(e.xp6(3),e.Q6J("value",t.messageForm),e.xp6(6),e.Q6J("ngModel",t.companyname)("ngClass",e.VKq(14,d,t.submitted&&!t.companyname)),e.xp6(4),e.Q6J("options",t.estados)("ngModel",t.status)("required",!0)("ngClass",e.VKq(16,d,t.submitted&&!t.status)),e.xp6(4),e.Q6J("ngModel",t.logoempresa),e.xp6(4),e.Q6J("ngModel",t.urlwsmysql)("ngClass",e.VKq(18,d,t.submitted&&!t.urlwsmysql)),e.xp6(4),e.Q6J("ngModel",t.dbcompanysap)("ngClass",e.VKq(20,d,t.submitted&&!t.dbcompanysap)),e.xp6(4),e.Q6J("ngModel",t.urlwssap)("ngClass",e.VKq(22,d,t.submitted&&!t.urlwssap)))},dependencies:[y.mk,i.Fj,i.JJ,i.Q7,i.On,b.Hq,M.Lt,w.V,f.o]});const g=function(a){return{"ng-invalid ng-dirty":a}};class h{constructor(n,t,o){this.messageService=n,this.adminService=t,this.authService=o,this.companyname="",this.status="",this.urlwsmysql="",this.logoempresa="",this.urlwssap="",this.dbcompanysap="",this.submitted=!1,this.messageForm=[],this.submitBotton=!1,this.estados=[{name:"Activo",code:"A"},{name:"Inactivo",code:"I"}]}ngOnInit(){}saveCompany(){if(this.submitted=!0,this.companyname&&this.urlwsmysql&&this.urlwssap&&this.status){this.submitBotton=!0;const n={companyname:this.companyname,status:this.status,urlwsmysql:this.urlwsmysql,logoempresa:this.logoempresa,urlwssap:this.urlwssap||"",dbcompanysap:this.dbcompanysap};this.adminService.saveCompany(this.authService.getToken(),n).subscribe({next:t=>{this.messageForm=[{severity:"success",summary:"!Genial\xa1",detail:`Ha registrado en el perfil ${this.companyname}`,life:3e3}]},error:t=>{this.submitBotton=!1,console.error(t)}})}else this.messageForm=[{severity:"error",summary:"!Opps\xa1",detail:"Debe diligenciar los campos resaltados en rojo",life:3e3}]}clear(){this.submitBotton=!1,this.submitted=!1,this.companyname="",this.status="",this.logoempresa="",this.urlwsmysql="",this.urlwssap="",this.dbcompanysap=""}}h.\u0275fac=function(n){return new(n||h)(e.Y36(p.ez),e.Y36(C.l),e.Y36(v.e))},h.\u0275cmp=e.Xpm({type:h,selectors:[["app-nueva-empresa"]],features:[e._Bn([p.ez])],decls:35,vars:25,consts:[[1,"grid"],[1,"col-12","md:col-6","col-offset-3"],[1,"card","p-fluid"],[3,"value","valueChange"],[1,"field"],["htmlFor","companyname"],["pInputText","","id","companyname","name","companyname","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","status"],["optionLabel","name","optionValue","code","id","status","name","status","placeholder","Seleccione el estado",3,"options","ngModel","required","ngClass","ngModelChange"],["htmlFor","logoempresa"],["pInputText","","id","logoempresa","name","logoempresa","type","text",3,"ngModel","ngModelChange"],["htmlFor","urlwsmysql"],["pInputText","","id","urlwsmysql","name","urlwsmysql","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","dbcompanysap"],["pInputText","","id","dbcompanysap","name","dbcompanysap","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","urlwssap"],["pInputText","","id","urlwssap","name","urlwssap","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],[1,"col"],["pButton","","label","Guardar","icon","pi pi-save",1,"p-button-outlined","mb-2","p-button-success",3,"disabled","click"],["pButton","","label","Limpiar","icon","pi pi-list",1,"p-button-outlined","mb-2","p-button-primary",3,"click"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-messages",3),e.NdJ("valueChange",function(s){return t.messageForm=s}),e.qZA(),e.TgZ(4,"h5"),e._uU(5,"Nueva empresa"),e.qZA(),e.TgZ(6,"div",4)(7,"label",5),e._uU(8,"Empresa"),e.qZA(),e.TgZ(9,"input",6),e.NdJ("ngModelChange",function(s){return t.companyname=s}),e.qZA()(),e.TgZ(10,"div",4)(11,"label",7),e._uU(12,"Estado"),e.qZA(),e.TgZ(13,"p-dropdown",8),e.NdJ("ngModelChange",function(s){return t.status=s}),e.qZA()(),e.TgZ(14,"div",4)(15,"label",9),e._uU(16,"Logo"),e.qZA(),e.TgZ(17,"input",10),e.NdJ("ngModelChange",function(s){return t.logoempresa=s}),e.qZA()(),e.TgZ(18,"div",4)(19,"label",11),e._uU(20,"BD MySQL"),e.qZA(),e.TgZ(21,"input",12),e.NdJ("ngModelChange",function(s){return t.urlwsmysql=s}),e.qZA()(),e.TgZ(22,"div",4)(23,"label",13),e._uU(24,"BD SAP"),e.qZA(),e.TgZ(25,"input",14),e.NdJ("ngModelChange",function(s){return t.dbcompanysap=s}),e.qZA()(),e.TgZ(26,"div",4)(27,"label",15),e._uU(28,"URL Webservice SAP"),e.qZA(),e.TgZ(29,"input",16),e.NdJ("ngModelChange",function(s){return t.urlwssap=s}),e.qZA()(),e.TgZ(30,"div",0)(31,"div",17)(32,"button",18),e.NdJ("click",function(){return t.saveCompany()}),e.qZA()(),e.TgZ(33,"div",17)(34,"button",19),e.NdJ("click",function(){return t.clear()}),e.qZA()()()()()()),2&n&&(e.xp6(3),e.Q6J("value",t.messageForm),e.xp6(6),e.Q6J("ngModel",t.companyname)("ngClass",e.VKq(15,g,t.submitted&&!t.companyname)),e.xp6(4),e.Q6J("options",t.estados)("ngModel",t.status)("required",!0)("ngClass",e.VKq(17,g,t.submitted&&!t.status)),e.xp6(4),e.Q6J("ngModel",t.logoempresa),e.xp6(4),e.Q6J("ngModel",t.urlwsmysql)("ngClass",e.VKq(19,g,t.submitted&&!t.urlwsmysql)),e.xp6(4),e.Q6J("ngModel",t.dbcompanysap)("ngClass",e.VKq(21,g,t.submitted&&!t.dbcompanysap)),e.xp6(4),e.Q6J("ngModel",t.urlwssap)("ngClass",e.VKq(23,g,t.submitted&&!t.urlwssap)),e.xp6(3),e.Q6J("disabled",t.submitBotton))},dependencies:[y.mk,i.Fj,i.JJ,i.Q7,i.On,b.Hq,M.Lt,w.V,f.o]});class r{}r.\u0275fac=function(n){return new(n||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[_.Bz.forChild([{path:"",component:u},{path:"nuevo",component:h},{path:"editar/:company",component:c}]),_.Bz]});var x=l(931);class m{}m.\u0275fac=function(n){return new(n||m)},m.\u0275mod=e.oAB({type:m}),m.\u0275inj=e.cJS({imports:[y.ez,i.u5,r,x.W]})}}]);
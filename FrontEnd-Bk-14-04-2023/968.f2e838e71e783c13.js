"use strict";(self.webpackChunksakai=self.webpackChunksakai||[]).push([[968],{3968:(j,y,a)=>{a.r(y),a.d(y,{MenuModule:()=>d});var M=a(6895),l=a(4006),c=a(9335),s=a(805),e=a(4650),v=a(9701),C=a(1562),f=a(5593),Z=a(1740),T=a(99);const F=["filter"];function N(r,t){if(1&r){const n=e.EpF();e.TgZ(0,"div",10)(1,"div")(2,"button",11),e.NdJ("click",function(){e.CHM(n);const i=e.oxw(),b=e.MAs(4);return e.KtG(i.clear(b))}),e.qZA(),e.TgZ(3,"button",12),e.NdJ("click",function(){e.CHM(n);const i=e.oxw();return e.KtG(i.newMenu())}),e.qZA(),e.TgZ(4,"button",13),e.NdJ("click",function(){e.CHM(n);const i=e.oxw();return e.KtG(i.editMenu())}),e.qZA()(),e.TgZ(5,"span",14),e._UZ(6,"i",15),e.TgZ(7,"input",16,17),e.NdJ("input",function(i){e.CHM(n);const b=e.oxw(),k=e.MAs(4);return e.KtG(b.onGlobalFilter(k,i))}),e.qZA()()()}if(2&r){const n=e.oxw();e.xp6(4),e.Q6J("disabled",!n.selectedMenu||1!=n.selectedMenu.length)}}function J(r,t){1&r&&(e.TgZ(0,"div",28)(1,"span",29),e._uU(2,"Agent Picker"),e.qZA()())}function U(r,t){}function w(r,t){1&r&&(e.TgZ(0,"tr"),e._UZ(1,"th",18),e.TgZ(2,"th")(3,"div",19),e._uU(4," Title "),e._UZ(5,"p-columnFilter",20),e.qZA()(),e.TgZ(6,"th")(7,"div",19),e._uU(8," Descripci\xf3n "),e._UZ(9,"p-columnFilter",21),e.qZA()(),e.TgZ(10,"th")(11,"div",19),e._uU(12," Orden men\xfa "),e.TgZ(13,"p-columnFilter",22),e.YNc(14,J,3,0,"ng-template",6),e.YNc(15,U,0,0,"ng-template",23),e.qZA()()(),e.TgZ(16,"th")(17,"div",19),e._uU(18," Jerarquia "),e._UZ(19,"p-columnFilter",24),e.qZA()(),e.TgZ(20,"th")(21,"div",19),e._uU(22," Padre "),e._UZ(23,"p-columnFilter",25),e.qZA()(),e.TgZ(24,"th")(25,"div",19),e._uU(26," Estado "),e._UZ(27,"p-columnFilter",26),e.qZA()(),e.TgZ(28,"th")(29,"div",19),e._uU(30," Icono "),e.qZA()(),e.TgZ(31,"th",27)(32,"div",19),e._uU(33," Accion "),e.qZA()()()),2&r&&(e.xp6(13),e.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1))}function S(r,t){if(1&r&&(e.TgZ(0,"tr")(1,"td"),e._UZ(2,"p-tableCheckbox",30),e.qZA(),e.TgZ(3,"td",31),e._uU(4),e.qZA(),e.TgZ(5,"td",31),e._uU(6),e.qZA(),e.TgZ(7,"td",31),e._uU(8),e.qZA(),e.TgZ(9,"td",31),e._uU(10),e.qZA(),e.TgZ(11,"td",32),e._uU(12),e.qZA(),e.TgZ(13,"td",31),e._uU(14),e.qZA(),e.TgZ(15,"td",33)(16,"div"),e._UZ(17,"span"),e.qZA()(),e._UZ(18,"td",34),e.qZA()),2&r){const n=t.$implicit;e.xp6(2),e.Q6J("value",n),e.xp6(2),e.hij(" ",n.title," "),e.xp6(2),e.hij(" ",n.description," "),e.xp6(2),e.hij(" ",n.ordernum," "),e.xp6(2),e.hij(" ",n.hierarchy," "),e.xp6(2),e.hij(" ",n.padre," "),e.xp6(2),e.hij(" ",n.estado," "),e.xp6(3),e.Tol(n.icon)}}function B(r,t){1&r&&(e.TgZ(0,"tr")(1,"td",35),e._uU(2,"No se econtraron opciones de men\xfa."),e.qZA()())}function x(r,t){1&r&&(e.TgZ(0,"tr")(1,"td",35),e._uU(2,"Cargando opcines del men\xfa. Por favor espere"),e.qZA()())}const Q=function(){return["title","description","ordernum","estado"]};class p{constructor(t,n,o){this.adminService=t,this.router=n,this.authService=o,this.menu=[],this.loading=!0,this.selectedMenu=[]}ngOnInit(){this.adminService.listMenu(this.authService.getTokenid()).subscribe({next:t=>{this.loading=!1,this.menu=t},error:t=>{console.error(t)}})}newMenu(){this.router.navigate(["/portal/admin/menu/nuevo"])}editMenu(){this.router.navigate(["/portal/admin/menu/editar",this.selectedMenu[0].id])}formatCurrency(t){return t.toLocaleString("en-US",{style:"currency",currency:"USD"})}onGlobalFilter(t,n){t.filterGlobal(n.target.value,"contains")}clear(t){t.clear(),this.filter.nativeElement.value=""}}p.\u0275fac=function(t){return new(t||p)(e.Y36(v.l),e.Y36(c.F0),e.Y36(C.e))},p.\u0275cmp=e.Xpm({type:p,selectors:[["app-menu"]],viewQuery:function(t,n){if(1&t&&e.Gf(F,5),2&t){let o;e.iGM(o=e.CRH())&&(n.filter=o.first)}},features:[e._Bn([s.ez,s.YP])],decls:10,vars:8,consts:[[1,"grid"],[1,"col-12"],[1,"card"],["dataKey","id","styleClass","p-datatable-gridlines","selectionMode","single","responsiveLayout","scroll",3,"value","rows","loading","rowHover","paginator","globalFilterFields","selection","selectionChange"],["dt1",""],["pTemplate","caption"],["pTemplate","header"],["pTemplate","body"],["pTemplate","emptymessage"],["pTemplate","loadingbody"],[1,"flex","justify-content-between","flex-column","sm:flex-row"],["pButton","","label","Limpiar","icon","pi pi-filter-slash",1,"p-button-outlined","mb-2","mr-2",3,"click"],["pButton","","label","Nuevo","icon","pi pi-plus",1,"p-button-outlined","mb-2","mr-2","p-button-success",3,"click"],["pButton","","label","Editar","icon","pi pi-pencil",1,"p-button-outlined","mb-2","mr-2","p-button-secondary",3,"disabled","click"],[1,"p-input-icon-left","mb-2"],[1,"pi","pi-search"],["pInputText","","type","text","placeholder","Buscar por palabra clave",1,"w-full",3,"input"],["filter",""],[2,"width","3rem"],[1,"flex","justify-content-between","align-items-center"],["type","text","field","title","display","menu","placeholder","Buscar por titulo"],["type","text","field","description","display","menu","placeholder","Buscar por descripci\xf3n"],["field","ordernum","matchMode","in","display","menu",3,"showMatchModes","showOperator","showAddButton"],["pTemplate","filter"],["type","text","field","hierarchy","display","menu","placeholder","Buscar por jerarquia"],["type","text","field","padre","display","menu","placeholder","Buscar por padre"],["type","text","field","estado","display","menu","placeholder","Buscar por estado"],[2,"width","8rem"],[1,"px-3","pt-3","pb-0"],[1,"font-bold"],[3,"value"],[2,"min-width","12rem"],[2,"min-width","8rem"],[1,"justify-content-center","align-items-center",2,"min-width","5rem"],[1,"text-center",2,"min-width","8rem"],["colspan","7"]],template:function(t,n){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-table",3,4),e.NdJ("selectionChange",function(i){return n.selectedMenu=i}),e.YNc(5,N,9,1,"ng-template",5),e.YNc(6,w,34,3,"ng-template",6),e.YNc(7,S,19,10,"ng-template",7),e.YNc(8,B,3,0,"ng-template",8),e.YNc(9,x,3,0,"ng-template",9),e.qZA()()()()),2&t&&(e.xp6(3),e.Q6J("value",n.menu)("rows",10)("loading",n.loading)("rowHover",!0)("paginator",!0)("globalFilterFields",e.DdM(7,Q))("selection",n.selectedMenu))},dependencies:[s.jx,f.Hq,Z.o,T.iA,T.UA,T.xl],styles:["[_nghost-%COMP%]     .p-frozen-column{font-weight:700}[_nghost-%COMP%]     .p-datatable-frozen-tbody{font-weight:700}[_nghost-%COMP%]     .p-progressbar{height:.5rem}"]});var A=a(2210),q=a(7772);const g=function(r){return{"ng-invalid ng-dirty":r}};class h{constructor(t,n,o){this.rutaActiva=t,this.adminService=n,this.authService=o,this.title="",this.description="",this.ordernum="",this.hierarchy="",this.url="",this.icon="",this.submitted=!1,this.padres=[],this.messageForm=[],this.submitBotton=!1,this.hierarchies=[{name:"Padre",code:"P"},{name:"Hijo",code:"H"}]}ngOnInit(){this.menuSelected=this.rutaActiva.snapshot.params,this.adminService.getMuenuById(this.authService.getToken(),this.menuSelected.menu).subscribe({next:t=>{this.title=t[0].title,this.description=t[0].description,this.hierarchy=t[0].hierarchy,this.url=t[0].url||"",this.icon=t[0].icon||"","H"==this.hierarchy&&(this.loadPadres(),this.padre=t[0].iddad),this.ordernum=t[0].ordernum},error:t=>{this.submitBotton=!1,console.log(t)}})}saveMenu(){if(this.submitted=!0,this.title&&this.hierarchy&&("H"!=this.hierarchy||this.padre)){this.submitBotton=!0;const t={id:this.menuSelected.menu,title:this.title,description:this.description,ordernum:this.ordernum,hierarchy:this.hierarchy,iddad:this.padre,url:this.url,icon:this.icon};this.adminService.updateMenuOpcion(this.authService.getToken(),t).subscribe({next:n=>{this.messageForm=[{severity:"success",summary:"!Genial\xa1",detail:`Ha actualizado la opci\xf3n del men\xfa ${this.title}`,life:3e3}]},error:n=>{this.submitBotton=!1,console.error(n)}})}else this.messageForm=[{severity:"error",summary:"!Opps\xa1",detail:"Debe diligenciar los campos resaltados en rojo",life:3e3}]}loadPadres(){this.ordernum="","H"==this.hierarchy?this.adminService.loadMenuFather(this.authService.getToken()).subscribe({next:t=>{this.padres=t},error:t=>{console.error(t)}}):(this.padres=[],this.loadOrederNum())}loadOrederNum(){this.adminService.orderNum(this.authService.getToken(),this.hierarchy,this.padre).subscribe({next:t=>{this.ordernum=t[0].ordernum},error:t=>{console.error(t)}})}clear(){this.title="",this.description="",this.hierarchy="",this.padre=0,this.url="",this.icon="",this.submitBotton=!1}}h.\u0275fac=function(t){return new(t||h)(e.Y36(c.gz),e.Y36(v.l),e.Y36(C.e))},h.\u0275cmp=e.Xpm({type:h,selectors:[["app-editar-menu"]],features:[e._Bn([s.ez])],decls:37,vars:24,consts:[[1,"grid"],[1,"col-12","md:col-6","col-offset-3"],[1,"card","p-fluid"],[3,"value","valueChange"],[1,"field"],["htmlFor","title"],["pInputText","","id","title","name","title","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","description"],["pInputText","","id","description","name","description","type","text",3,"ngModel","ngModelChange"],["htmlFor","hierarchy"],["optionLabel","name","optionValue","code","id","hierarchy","name","hierarchy","placeholder","Seleccione la jerarquia",3,"options","ngModel","required","ngClass","ngModelChange","onChange"],["htmlFor","padre"],["optionLabel","title","optionValue","id","id","padre","name","padre","placeholder","Seleccione el men\xfa padre",3,"options","ngModel","required","ngClass","ngModelChange","onChange"],["htmlFor","ordernum"],["pInputText","","id","ordernum","name","ordernum","type","text","required","","readonly","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","url"],["pInputText","","id","url","name","url","type","text",3,"ngModel","ngModelChange"],["htmlFor","icon"],["pInputText","","id","icon","name","icon","type","text",3,"ngModel","ngModelChange"],[1,"col"],["pButton","","label","Guardar","icon","pi pi-save",1,"p-button-outlined","mb-2","p-button-success",3,"click"]],template:function(t,n){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-messages",3),e.NdJ("valueChange",function(i){return n.messageForm=i}),e.qZA(),e.TgZ(4,"h5"),e._uU(5,"Editar men\xfa"),e.qZA(),e.TgZ(6,"div",4)(7,"label",5),e._uU(8,"T\xedtulo"),e.qZA(),e.TgZ(9,"input",6),e.NdJ("ngModelChange",function(i){return n.title=i}),e.qZA()(),e.TgZ(10,"div",4)(11,"label",7),e._uU(12,"Descripci\xf3n"),e.qZA(),e.TgZ(13,"input",8),e.NdJ("ngModelChange",function(i){return n.description=i}),e.qZA()(),e.TgZ(14,"div",4)(15,"label",9),e._uU(16,"Jerarquia"),e.qZA(),e.TgZ(17,"p-dropdown",10),e.NdJ("ngModelChange",function(i){return n.hierarchy=i})("onChange",function(){return n.loadPadres()}),e.qZA()(),e.TgZ(18,"div",4)(19,"label",11),e._uU(20,"Padre"),e.qZA(),e.TgZ(21,"p-dropdown",12),e.NdJ("ngModelChange",function(i){return n.padre=i})("onChange",function(){return n.loadOrederNum()}),e.qZA()(),e.TgZ(22,"div",4)(23,"label",13),e._uU(24,"Posici\xf3n men\xfa"),e.qZA(),e.TgZ(25,"input",14),e.NdJ("ngModelChange",function(i){return n.ordernum=i}),e.qZA()(),e.TgZ(26,"div",4)(27,"label",15),e._uU(28,"URL"),e.qZA(),e.TgZ(29,"input",16),e.NdJ("ngModelChange",function(i){return n.url=i}),e.qZA()(),e.TgZ(30,"div",4)(31,"label",17),e._uU(32,"Icono"),e.qZA(),e.TgZ(33,"input",18),e.NdJ("ngModelChange",function(i){return n.icon=i}),e.qZA()(),e.TgZ(34,"div",0)(35,"div",19)(36,"button",20),e.NdJ("click",function(){return n.saveMenu()}),e.qZA()()()()()()),2&t&&(e.xp6(3),e.Q6J("value",n.messageForm),e.xp6(6),e.Q6J("ngModel",n.title)("ngClass",e.VKq(16,g,n.submitted&&!n.title)),e.xp6(4),e.Q6J("ngModel",n.description),e.xp6(4),e.Q6J("options",n.hierarchies)("ngModel",n.hierarchy)("required",!0)("ngClass",e.VKq(18,g,n.submitted&&!n.hierarchy)),e.xp6(4),e.Q6J("options",n.padres)("ngModel",n.padre)("required",!0)("ngClass",e.VKq(20,g,n.submitted&&!n.padre&&"H"==n.hierarchy)),e.xp6(4),e.Q6J("ngModel",n.ordernum)("ngClass",e.VKq(22,g,n.submitted&&!n.ordernum)),e.xp6(4),e.Q6J("ngModel",n.url),e.xp6(4),e.Q6J("ngModel",n.icon))},dependencies:[M.mk,l.Fj,l.JJ,l.Q7,l.On,f.Hq,A.Lt,q.V,Z.o]});const _=function(r){return{"ng-invalid ng-dirty":r}};class m{constructor(t,n,o){this.messageService=t,this.adminService=n,this.authService=o,this.title="",this.description="",this.ordernum="",this.hierarchy="",this.url="",this.icon="",this.submitted=!1,this.padres=[],this.messageForm=[],this.submitBotton=!1,this.hierarchies=[{name:"Padre",code:"P"},{name:"Hijo",code:"H"}]}ngOnInit(){}saveMenu(){if(this.submitted=!0,this.title&&this.hierarchy&&("H"!=this.hierarchy||this.padre)){this.submitBotton=!0;const t={title:this.title,description:this.description,ordernum:this.ordernum,hierarchy:this.hierarchy,iddad:this.padre,url:this.url,icon:this.icon};this.adminService.saveMenuOpcion(this.authService.getToken(),t).subscribe({next:n=>{this.messageForm=[{severity:"success",summary:"!Genial\xa1",detail:`Ha registrado en el men\xfa la opci\xf3n ${this.title}`,life:3e3}]},error:n=>{this.submitBotton=!1,console.error(n)}})}else this.messageForm=[{severity:"error",summary:"!Opps\xa1",detail:"Debe diligenciar los campos resaltados en rojo",life:3e3}]}loadPadres(){this.ordernum="","H"==this.hierarchy?this.adminService.loadMenuFather(this.authService.getToken()).subscribe({next:t=>{this.padres=t},error:t=>{console.error(t)}}):(this.padres=[],this.loadOrederNum())}loadOrederNum(){this.adminService.orderNum(this.authService.getToken(),this.hierarchy,this.padre).subscribe({next:t=>{this.ordernum=t[0].ordernum},error:t=>{console.error(t)}})}clear(){this.submitBotton=!1,this.submitted=!1,this.title="",this.description="",this.hierarchy="",this.padre=0,this.url="",this.icon="",this.ordernum=""}}m.\u0275fac=function(t){return new(t||m)(e.Y36(s.ez),e.Y36(v.l),e.Y36(C.e))},m.\u0275cmp=e.Xpm({type:m,selectors:[["app-nuevo-menu"]],features:[e._Bn([s.ez])],decls:39,vars:25,consts:[[1,"grid"],[1,"col-12","md:col-6","col-offset-3"],[1,"card","p-fluid"],[3,"value","valueChange"],[1,"field"],["htmlFor","title"],["pInputText","","id","title","name","title","type","text","required","","autofocus","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","description"],["pInputText","","id","description","name","description","type","text",3,"ngModel","ngModelChange"],["htmlFor","hierarchy"],["optionLabel","name","optionValue","code","id","hierarchy","name","hierarchy","placeholder","Seleccione la jerarquia",3,"options","ngModel","required","ngClass","ngModelChange","onChange"],["htmlFor","padre"],["optionLabel","title","optionValue","id","id","padre","name","padre","placeholder","Seleccione el men\xfa padre",3,"options","ngModel","required","ngClass","ngModelChange","onChange"],["htmlFor","ordernum"],["pInputText","","id","ordernum","name","ordernum","type","text","required","","readonly","",3,"ngModel","ngClass","ngModelChange"],["htmlFor","url"],["pInputText","","id","url","name","url","type","text",3,"ngModel","ngModelChange"],["htmlFor","icon"],["pInputText","","id","icon","name","icon","type","text",3,"ngModel","ngModelChange"],[1,"col"],["pButton","","label","Guardar","icon","pi pi-save",1,"p-button-outlined","mb-2","p-button-success",3,"disabled","click"],["pButton","","label","Limpiar","icon","pi pi-list",1,"p-button-outlined","mb-2","p-button-primary",3,"click"]],template:function(t,n){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"p-messages",3),e.NdJ("valueChange",function(i){return n.messageForm=i}),e.qZA(),e.TgZ(4,"h5"),e._uU(5,"Nuevo men\xfa"),e.qZA(),e.TgZ(6,"div",4)(7,"label",5),e._uU(8,"T\xedtulo"),e.qZA(),e.TgZ(9,"input",6),e.NdJ("ngModelChange",function(i){return n.title=i}),e.qZA()(),e.TgZ(10,"div",4)(11,"label",7),e._uU(12,"Descripci\xf3n"),e.qZA(),e.TgZ(13,"input",8),e.NdJ("ngModelChange",function(i){return n.description=i}),e.qZA()(),e.TgZ(14,"div",4)(15,"label",9),e._uU(16,"Jerarquia"),e.qZA(),e.TgZ(17,"p-dropdown",10),e.NdJ("ngModelChange",function(i){return n.hierarchy=i})("onChange",function(){return n.loadPadres()}),e.qZA()(),e.TgZ(18,"div",4)(19,"label",11),e._uU(20,"Padre"),e.qZA(),e.TgZ(21,"p-dropdown",12),e.NdJ("ngModelChange",function(i){return n.padre=i})("onChange",function(){return n.loadOrederNum()}),e.qZA()(),e.TgZ(22,"div",4)(23,"label",13),e._uU(24,"Posici\xf3n men\xfa"),e.qZA(),e.TgZ(25,"input",14),e.NdJ("ngModelChange",function(i){return n.ordernum=i}),e.qZA()(),e.TgZ(26,"div",4)(27,"label",15),e._uU(28,"URL"),e.qZA(),e.TgZ(29,"input",16),e.NdJ("ngModelChange",function(i){return n.url=i}),e.qZA()(),e.TgZ(30,"div",4)(31,"label",17),e._uU(32,"Icono"),e.qZA(),e.TgZ(33,"input",18),e.NdJ("ngModelChange",function(i){return n.icon=i}),e.qZA()(),e.TgZ(34,"div",0)(35,"div",19)(36,"button",20),e.NdJ("click",function(){return n.saveMenu()}),e.qZA()(),e.TgZ(37,"div",19)(38,"button",21),e.NdJ("click",function(){return n.clear()}),e.qZA()()()()()()),2&t&&(e.xp6(3),e.Q6J("value",n.messageForm),e.xp6(6),e.Q6J("ngModel",n.title)("ngClass",e.VKq(17,_,n.submitted&&!n.title)),e.xp6(4),e.Q6J("ngModel",n.description),e.xp6(4),e.Q6J("options",n.hierarchies)("ngModel",n.hierarchy)("required",!0)("ngClass",e.VKq(19,_,n.submitted&&!n.hierarchy)),e.xp6(4),e.Q6J("options",n.padres)("ngModel",n.padre)("required",!0)("ngClass",e.VKq(21,_,n.submitted&&!n.padre&&"H"==n.hierarchy)),e.xp6(4),e.Q6J("ngModel",n.ordernum)("ngClass",e.VKq(23,_,n.submitted&&!n.ordernum)),e.xp6(4),e.Q6J("ngModel",n.url),e.xp6(4),e.Q6J("ngModel",n.icon),e.xp6(3),e.Q6J("disabled",n.submitBotton))},dependencies:[M.mk,l.Fj,l.JJ,l.Q7,l.On,f.Hq,A.Lt,q.V,Z.o]});class u{}u.\u0275fac=function(t){return new(t||u)},u.\u0275mod=e.oAB({type:u}),u.\u0275inj=e.cJS({imports:[c.Bz.forChild([{path:"",component:p},{path:"nuevo",component:m},{path:"editar/:menu",component:h}]),c.Bz]});var H=a(931);class d{}d.\u0275fac=function(t){return new(t||d)},d.\u0275mod=e.oAB({type:d}),d.\u0275inj=e.cJS({imports:[M.ez,l.u5,u,H.W]})}}]);
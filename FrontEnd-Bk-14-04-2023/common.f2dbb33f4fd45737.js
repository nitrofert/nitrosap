(self.webpackChunksakai=self.webpackChunksakai||[]).push([[592],{3535:(m,f,c)=>{"use strict";c.d(f,{a:()=>s,h:()=>d});var e=c(6895),o=c(4650);const _=["code"];class d{constructor(i){this.el=i,this.lang="markup"}ngAfterViewInit(){window.Prism&&window.Prism.highlightElement(this.codeViewChild.nativeElement)}}d.\u0275fac=function(i){return new(i||d)(o.Y36(o.SBq))},d.\u0275cmp=o.Xpm({type:d,selectors:[["app-code"]],viewQuery:function(i,r){if(1&i&&o.Gf(_,5),2&i){let n;o.iGM(n=o.CRH())&&(r.codeViewChild=n.first)}},inputs:{lang:"lang"},ngContentSelectors:["*"],decls:5,vars:1,consts:[[3,"ngClass"],["code",""]],template:function(i,r){1&i&&(o.F$t(),o.TgZ(0,"pre",0)(1,"code",null,1),o.Hsn(3),o._uU(4,"\n"),o.qZA()()),2&i&&o.Q6J("ngClass","language-"+r.lang)},dependencies:[e.mk],styles:["pre[class*=language-]{border-radius:12px!important}pre[class*=language-]:before,pre[class*=language-]:after{display:none!important}pre[class*=language-] code{border-left:.5rem solid transparent!important;box-shadow:none!important;background:var(--surface-ground)!important;margin:0!important;color:var(--surface-900);font-size:14px;border-radius:10px!important}pre[class*=language-] code .token.tag,pre[class*=language-] code .token.keyword,pre[class*=language-] code .token.attr-name,pre[class*=language-] code .token.attr-string{color:#2196f3!important}pre[class*=language-] code .token.attr-value{color:#4caf50!important}pre[class*=language-] code .token.punctuation{color:var(--text-color)}pre[class*=language-] code .token.operator,pre[class*=language-] code .token.string{background:transparent}\n"],encapsulation:2});class s{}s.\u0275fac=function(i){return new(i||s)},s.\u0275mod=o.oAB({type:s}),s.\u0275inj=o.cJS({imports:[e.ez]})},7453:(m,f,c)=>{"use strict";c.d(f,{L:()=>o});var e=c(4650);class o{transform(p,d){switch(d){case"solped":case"pedido":switch(p){case"O":return"Abierta";case"C":return"Cerrada";default:return p}break;case"entrada":switch(p){case"bost_Open":case"O":return"Abierta";case"bost_Close":return"Cerrada";case"C":return"Cancelada";default:return p}break;case"aprobacion":switch(p){case"N":return"No enviada";case"A":return"Aprobada";case"P":return"Pendiente";case"R":return"Rechazada";case"C":return"Cancelada";default:return p}break;default:return p}}}o.\u0275fac=function(p){return new(p||o)},o.\u0275pipe=e.Yjl({name:"estados",type:o,pure:!0})},3983:(m,f,c)=>{"use strict";c.d(f,{G:()=>o});var e=c(4650);class o{}o.\u0275fac=function(p){return new(p||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({})},1707:(m,f,c)=>{"use strict";c.d(f,{E:()=>o});var e=c(4650);class o{transform(p,d,s){return p.length>=d&&(p=p.substring(0,d)+" ..."),p}}o.\u0275fac=function(p){return new(p||o)},o.\u0275pipe=e.Yjl({name:"tooltips",type:o,pure:!0})},9701:(m,f,c)=>{"use strict";c.d(f,{l:()=>p});var e=c(4650),o=c(529),_=c(2591);class p{constructor(s,t){this.http=s,this.urlApiService=t,this.api_url="",this.api_url=this.urlApiService.getUrlAPI()}listMenu(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/menu/list`,i)}loadMenuFather(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/menu/listFather`,i)}orderNum(s,t,i){const n={headers:this.urlApiService.getHeadersAPI(s)};let a="";return t&&(a=a+"/"+t),void 0===i?console.log("padre undefined"):a+=`/${i}`,this.http.get(`${this.api_url}/api/menu/orderNum${a}`,n)}saveMenuOpcion(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/menu`,t,r)}getMuenuById(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/menu/${t}`,r)}updateMenuOpcion(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.put(`${this.api_url}/api/menu`,t,r)}listPerfil(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/perfiles/list`,i)}savePerfil(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/perfiles`,t,r)}getPerfilById(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/perfiles/${t}`,r)}updatePerfil(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.put(`${this.api_url}/api/perfiles`,t,r)}listCompanies(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/companies/list`,i)}saveCompany(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/companies`,t,r)}getCompanyById(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/companies/${t}`,r)}updateCompany(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.put(`${this.api_url}/api/companies`,t,r)}listPermisos(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/permisos/list`,i)}setPermiso(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/permisos`,t,r)}listUsuarios(s){const i={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/usuarios/list`,i)}saveUser(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/usuarios`,t,r)}getUserById(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/usuarios/${t}`,r)}updateUser(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.put(`${this.api_url}/api/usuarios`,t,r)}getCompaniesUser(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/usuarios/companies/${t}`,r)}setAccess(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/usuarios/companies`,t,r)}getPerfilesUser(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.get(`${this.api_url}/api/usuarios/perfiles/${t}`,r)}setPerfilUser(s,t){const r={headers:this.urlApiService.getHeadersAPI(s)};return this.http.post(`${this.api_url}/api/usuarios/perfiles`,t,r)}}p.\u0275fac=function(s){return new(s||p)(e.LFG(o.eN),e.LFG(_.Z))},p.\u0275prov=e.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"})},9090:(m,f,c)=>{"use strict";c.d(f,{L:()=>_});var e=c(4650),o=c(8676);class _{constructor(){this.breadcrumb=[]}ngOnInit(){if(this.home={icon:"pi pi-home",routerLink:"/"},""!=this.urlBreadCrumb){let d=this.urlBreadCrumb.split("/");for(let s of d)this.breadcrumb.push({label:s});this.breadcrumb.shift(),this.breadcrumb.shift()}}}_.\u0275fac=function(d){return new(d||_)},_.\u0275cmp=e.Xpm({type:_,selectors:[["app-breadcrumb"]],inputs:{urlBreadCrumb:"urlBreadCrumb"},decls:4,vars:2,consts:[[1,"grid"],[1,"col-12"],[1,"card"],[3,"model","home"]],template:function(d,s){1&d&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e._UZ(3,"p-breadcrumb",3),e.qZA()()()),2&d&&(e.xp6(3),e.Q6J("model",s.breadcrumb)("home",s.home))},dependencies:[o.a]})},3837:(m,f,c)=>{"use strict";c.d(f,{S:()=>_});var e=c(931),o=c(4650);class _{}_.\u0275fac=function(d){return new(d||_)},_.\u0275mod=o.oAB({type:_}),_.\u0275inj=o.cJS({imports:[e.W]})},4327:function(m,f){var c,o;void 0!==(o="function"==typeof(c=function(){"use strict";function p(n,a,u){var l=new XMLHttpRequest;l.open("GET",n),l.responseType="blob",l.onload=function(){r(l.response,a,u)},l.onerror=function(){console.error("could not download file")},l.send()}function d(n){var a=new XMLHttpRequest;a.open("HEAD",n,!1);try{a.send()}catch{}return 200<=a.status&&299>=a.status}function s(n){try{n.dispatchEvent(new MouseEvent("click"))}catch{var a=document.createEvent("MouseEvents");a.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),n.dispatchEvent(a)}}var t="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,i=t.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),r=t.saveAs||("object"!=typeof window||window!==t?function(){}:"download"in HTMLAnchorElement.prototype&&!i?function(n,a,u){var l=t.URL||t.webkitURL,h=document.createElement("a");h.download=a=a||n.name||"download",h.rel="noopener","string"==typeof n?(h.href=n,h.origin===location.origin?s(h):d(h.href)?p(n,a,u):s(h,h.target="_blank")):(h.href=l.createObjectURL(n),setTimeout(function(){l.revokeObjectURL(h.href)},4e4),setTimeout(function(){s(h)},0))}:"msSaveOrOpenBlob"in navigator?function(n,a,u){if(a=a||n.name||"download","string"!=typeof n)navigator.msSaveOrOpenBlob(function _(n,a){return typeof a>"u"?a={autoBom:!1}:"object"!=typeof a&&(console.warn("Deprecated: Expected third argument to be a object"),a={autoBom:!a}),a.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(n.type)?new Blob(["\ufeff",n],{type:n.type}):n}(n,u),a);else if(d(n))p(n,a,u);else{var l=document.createElement("a");l.href=n,l.target="_blank",setTimeout(function(){s(l)})}}:function(n,a,u,l){if((l=l||open("","_blank"))&&(l.document.title=l.document.body.innerText="downloading..."),"string"==typeof n)return p(n,a,u);var h="application/octet-stream"===n.type,g=/constructor/i.test(t.HTMLElement)||t.safari,v=/CriOS\/[\d]+/.test(navigator.userAgent);if((v||h&&g||i)&&typeof FileReader<"u"){var A=new FileReader;A.onloadend=function(){var b=A.result;b=v?b:b.replace(/^data:[^;]*;/,"data:attachment/file;"),l?l.location.href=b:location=b,l=null},A.readAsDataURL(n)}else{var y=t.URL||t.webkitURL,C=y.createObjectURL(n);l?l.location=C:location.href=C,l=null,setTimeout(function(){y.revokeObjectURL(C)},4e4)}});t.saveAs=r.saveAs=r,m.exports=r})?c.apply(f,[]):c)&&(m.exports=o)},2722:(m,f,c)=>{"use strict";c.d(f,{R:()=>d});var e=c(4482),o=c(5403),_=c(8421),p=c(5032);function d(s){return(0,e.e)((t,i)=>{(0,_.Xf)(s).subscribe((0,o.x)(i,()=>i.complete(),p.Z)),!i.closed&&t.subscribe(i)})}},4408:(m,f,c)=>{"use strict";c.d(f,{o:()=>d});var e=c(727);class o extends e.w0{constructor(t,i){super()}schedule(t,i=0){return this}}const _={setInterval(s,t,...i){const{delegate:r}=_;return r?.setInterval?r.setInterval(s,t,...i):setInterval(s,t,...i)},clearInterval(s){const{delegate:t}=_;return(t?.clearInterval||clearInterval)(s)},delegate:void 0};var p=c(8737);class d extends o{constructor(t,i){super(t,i),this.scheduler=t,this.work=i,this.pending=!1}schedule(t,i=0){if(this.closed)return this;this.state=t;const r=this.id,n=this.scheduler;return null!=r&&(this.id=this.recycleAsyncId(n,r,i)),this.pending=!0,this.delay=i,this.id=this.id||this.requestAsyncId(n,this.id,i),this}requestAsyncId(t,i,r=0){return _.setInterval(t.flush.bind(t,this),r)}recycleAsyncId(t,i,r=0){if(null!=r&&this.delay===r&&!1===this.pending)return i;_.clearInterval(i)}execute(t,i){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const r=this._execute(t,i);if(r)return r;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(t,i){let n,r=!1;try{this.work(t)}catch(a){r=!0,n=a||new Error("Scheduled action threw falsy error")}if(r)return this.unsubscribe(),n}unsubscribe(){if(!this.closed){const{id:t,scheduler:i}=this,{actions:r}=i;this.work=this.state=this.scheduler=null,this.pending=!1,(0,p.P)(r,this),null!=t&&(this.id=this.recycleAsyncId(i,t,null)),this.delay=null,super.unsubscribe()}}}},7565:(m,f,c)=>{"use strict";c.d(f,{v:()=>_});var e=c(6063);class o{constructor(d,s=o.now){this.schedulerActionCtor=d,this.now=s}schedule(d,s=0,t){return new this.schedulerActionCtor(this,d).schedule(t,s)}}o.now=e.l.now;class _ extends o{constructor(d,s=o.now){super(d,s),this.actions=[],this._active=!1,this._scheduled=void 0}flush(d){const{actions:s}=this;if(this._active)return void s.push(d);let t;this._active=!0;do{if(t=d.execute(d.state,d.delay))break}while(d=s.shift());if(this._active=!1,t){for(;d=s.shift();)d.unsubscribe();throw t}}}},4986:(m,f,c)=>{"use strict";c.d(f,{P:()=>p,z:()=>_});var e=c(4408);const _=new(c(7565).v)(e.o),p=_},7147:(m,f,c)=>{"use strict";c.d(f,{A:()=>n,o:()=>a});var e=c(4650),o=c(6895);function _(u,l){if(1&u&&e._UZ(0,"img",6),2&u){const h=e.oxw(2);e.Q6J("src",h.image,e.LSH)}}function p(u,l){if(1&u&&e._UZ(0,"span",8),2&u){const h=e.oxw(3);e.Tol(h.icon),e.Q6J("ngClass","p-chip-icon")}}function d(u,l){if(1&u&&e.YNc(0,p,1,3,"span",7),2&u){const h=e.oxw(2);e.Q6J("ngIf",h.icon)}}function s(u,l){if(1&u&&(e.TgZ(0,"div",9),e._uU(1),e.qZA()),2&u){const h=e.oxw(2);e.xp6(1),e.Oqu(h.label)}}function t(u,l){if(1&u){const h=e.EpF();e.TgZ(0,"span",10),e.NdJ("click",function(v){e.CHM(h);const A=e.oxw(2);return e.KtG(A.close(v))})("keydown.enter",function(v){e.CHM(h);const A=e.oxw(2);return e.KtG(A.close(v))}),e.qZA()}if(2&u){const h=e.oxw(2);e.Tol(h.removeIcon),e.Q6J("ngClass","pi-chip-remove-icon")}}function i(u,l){if(1&u&&(e.TgZ(0,"div",1),e.Hsn(1),e.YNc(2,_,1,1,"img",2),e.YNc(3,d,1,1,"ng-template",null,3,e.W1O),e.YNc(5,s,2,1,"div",4),e.YNc(6,t,1,3,"span",5),e.qZA()),2&u){const h=e.MAs(4),g=e.oxw();e.Tol(g.styleClass),e.Q6J("ngClass",g.containerClass())("ngStyle",g.style),e.xp6(2),e.Q6J("ngIf",g.image)("ngIfElse",h),e.xp6(3),e.Q6J("ngIf",g.label),e.xp6(1),e.Q6J("ngIf",g.removable)}}const r=["*"];let n=(()=>{class u{constructor(){this.removeIcon="pi pi-times-circle",this.onRemove=new e.vpe,this.visible=!0}containerClass(){return{"p-chip p-component":!0,"p-chip-image":null!=this.image}}close(h){this.visible=!1,this.onRemove.emit(h)}}return u.\u0275fac=function(h){return new(h||u)},u.\u0275cmp=e.Xpm({type:u,selectors:[["p-chip"]],hostAttrs:[1,"p-element"],inputs:{label:"label",icon:"icon",image:"image",style:"style",styleClass:"styleClass",removable:"removable",removeIcon:"removeIcon"},outputs:{onRemove:"onRemove"},ngContentSelectors:r,decls:1,vars:1,consts:[[3,"ngClass","class","ngStyle",4,"ngIf"],[3,"ngClass","ngStyle"],[3,"src",4,"ngIf","ngIfElse"],["iconTemplate",""],["class","p-chip-text",4,"ngIf"],["tabindex","0",3,"class","ngClass","click","keydown.enter",4,"ngIf"],[3,"src"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[1,"p-chip-text"],["tabindex","0",3,"ngClass","click","keydown.enter"]],template:function(h,g){1&h&&(e.F$t(),e.YNc(0,i,7,8,"div",0)),2&h&&e.Q6J("ngIf",g.visible)},dependencies:[o.mk,o.O5,o.PC],styles:[".p-chip{display:inline-flex;align-items:center}.p-chip-text,.p-chip-icon.pi{line-height:1.5}.pi-chip-remove-icon{line-height:1.5;cursor:pointer}.p-chip img{border-radius:50%}\n"],encapsulation:2,changeDetection:0}),u})(),a=(()=>{class u{}return u.\u0275fac=function(h){return new(h||u)},u.\u0275mod=e.oAB({type:u}),u.\u0275inj=e.cJS({imports:[o.ez]}),u})()},1383:(m,f,c)=>{"use strict";c.d(f,{V:()=>n,o:()=>r});var e=c(4650),o=c(6895),_=c(805);function p(a,u){1&a&&e.GkF(0)}function d(a,u){if(1&a&&(e.TgZ(0,"div",3),e.YNc(1,p,1,0,"ng-container",4),e.qZA()),2&a){const l=e.oxw();e.xp6(1),e.Q6J("ngTemplateOutlet",l.leftTemplate)}}function s(a,u){1&a&&e.GkF(0)}function t(a,u){if(1&a&&(e.TgZ(0,"div",5),e.YNc(1,s,1,0,"ng-container",4),e.qZA()),2&a){const l=e.oxw();e.xp6(1),e.Q6J("ngTemplateOutlet",l.rightTemplate)}}const i=["*"];let r=(()=>{class a{constructor(l){this.el=l}getBlockableElement(){return this.el.nativeElement.children[0]}ngAfterContentInit(){this.templates.forEach(l=>{switch(l.getType()){case"left":this.leftTemplate=l.template;break;case"right":this.rightTemplate=l.template}})}}return a.\u0275fac=function(l){return new(l||a)(e.Y36(e.SBq))},a.\u0275cmp=e.Xpm({type:a,selectors:[["p-toolbar"]],contentQueries:function(l,h,g){if(1&l&&e.Suo(g,_.jx,4),2&l){let v;e.iGM(v=e.CRH())&&(h.templates=v)}},hostAttrs:[1,"p-element"],inputs:{style:"style",styleClass:"styleClass"},ngContentSelectors:i,decls:4,vars:6,consts:[["role","toolbar",3,"ngClass","ngStyle"],["class","p-toolbar-group-left",4,"ngIf"],["class","p-toolbar-group-right",4,"ngIf"],[1,"p-toolbar-group-left"],[4,"ngTemplateOutlet"],[1,"p-toolbar-group-right"]],template:function(l,h){1&l&&(e.F$t(),e.TgZ(0,"div",0),e.Hsn(1),e.YNc(2,d,2,1,"div",1),e.YNc(3,t,2,1,"div",2),e.qZA()),2&l&&(e.Tol(h.styleClass),e.Q6J("ngClass","p-toolbar p-component")("ngStyle",h.style),e.xp6(2),e.Q6J("ngIf",h.leftTemplate),e.xp6(1),e.Q6J("ngIf",h.rightTemplate))},dependencies:[o.mk,o.O5,o.tP,o.PC],styles:[".p-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.p-toolbar-group-left,.p-toolbar-group-right{display:flex;align-items:center}\n"],encapsulation:2,changeDetection:0}),a})(),n=(()=>{class a{}return a.\u0275fac=function(l){return new(l||a)},a.\u0275mod=e.oAB({type:a}),a.\u0275inj=e.cJS({imports:[o.ez]}),a})()}}]);
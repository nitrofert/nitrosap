"use strict";(self.webpackChunksakai=self.webpackChunksakai||[]).push([[58],{58:(v,d,i)=>{i.r(d),i.d(d,{FileDemoModule:()=>a});var m=i(6895),f=i(4006),c=i(3388),u=i(9335),s=i(805),e=i(4650);function r(l,o){if(1&l&&(e.TgZ(0,"li"),e._uU(1),e.qZA()),2&l){const n=o.$implicit;e.xp6(1),e.AsE("",n.name," - ",n.size," bytes")}}function F(l,o){if(1&l&&(e.TgZ(0,"ul"),e.YNc(1,r,2,2,"li",7),e.qZA()),2&l){const n=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",n.uploadedFiles)}}function g(l,o){if(1&l&&e.YNc(0,F,2,1,"ul",6),2&l){const n=e.oxw();e.Q6J("ngIf",n.uploadedFiles.length)}}class p{constructor(o){this.messageService=o,this.uploadedFiles=[]}onUpload(o){for(const n of o.files)this.uploadedFiles.push(n);this.messageService.add({severity:"info",summary:"Success",detail:"File Uploaded"})}onBasicUpload(){this.messageService.add({severity:"info",summary:"Success",detail:"File Uploaded with Basic Mode"})}}p.\u0275fac=function(o){return new(o||p)(e.Y36(s.ez))},p.\u0275cmp=e.Xpm({type:p,selectors:[["ng-component"]],features:[e._Bn([s.ez])],decls:10,vars:3,consts:[[1,"grid"],[1,"col-12"],[1,"card"],["name","demo[]","url","./upload.php","accept","image/*",3,"multiple","maxFileSize","onUpload"],["pTemplate","content"],["mode","basic","name","demo[]","url","./upload.php","accept","image/*",3,"maxFileSize","onUpload"],[4,"ngIf"],[4,"ngFor","ngForOf"]],template:function(o,n){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"h5"),e._uU(4,"Advanced"),e.qZA(),e.TgZ(5,"p-fileUpload",3),e.NdJ("onUpload",function(h){return n.onUpload(h)}),e.YNc(6,g,1,1,"ng-template",4),e.qZA(),e.TgZ(7,"h5"),e._uU(8,"Basic"),e.qZA(),e.TgZ(9,"p-fileUpload",5),e.NdJ("onUpload",function(){return n.onBasicUpload()}),e.qZA()()()()),2&o&&(e.xp6(5),e.Q6J("multiple",!0)("maxFileSize",1e6),e.xp6(4),e.Q6J("maxFileSize",1e6))},dependencies:[m.sg,m.O5,c.p,s.jx],encapsulation:2});class t{}t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[u.Bz.forChild([{path:"",component:p}]),u.Bz]});class a{}a.\u0275fac=function(o){return new(o||a)},a.\u0275mod=e.oAB({type:a}),a.\u0275inj=e.cJS({imports:[m.ez,f.u5,t,c.O]})}}]);
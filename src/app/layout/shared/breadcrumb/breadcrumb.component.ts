import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

@Input() urlBreadCrumb!:string;
breadcrumb:any[]=[];
home:any;

  constructor() { }

  ngOnInit(): void {
    this.home =  {icon: 'pi pi-home', routerLink: '/'};
    if(this.urlBreadCrumb!=''){
      let tmpBreadCrumb = this.urlBreadCrumb.split("/",);
      for(let item of tmpBreadCrumb){
          //console.log(item);
          this.breadcrumb.push({label:item});
      }
       this.breadcrumb.shift();
       this.breadcrumb.shift();
    }
    

  }

}

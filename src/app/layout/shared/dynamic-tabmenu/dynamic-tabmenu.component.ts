import { Component, Input, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-dynamic-tabmenu',
  templateUrl: './dynamic-tabmenu.component.html',
  styleUrls: ['./dynamic-tabmenu.component.scss']
})
export class DynamicTabmenuComponent implements OnInit {

  @Input() menuItems!: MenuItem[];
  
  items!: MenuItem[];
  activeItem!: MenuItem;
  tabs:any[] = [];

   ngOnInit() {
      

      this.items = this.menuItems;
      this.activeItem = this.items[0];
      
      this.crearTabs();
  }

  selectMenu(tab:any){
    console.log(tab.activeItem.tabindex);
    this.resetTabs();
    let tabIndex = tab.activeItem.tabindex;
    this.tabs[tabIndex].status = true;
  }

  crearTabs(){
    for(let index in this.items){
      this.tabs.push({ tabindex:index, status: index=='0'?true:false, content:this.items[index].queryParams});
    }
  }

  llenarTabs(){
    for(let tab of this.tabs){
      let tabContent = document.getElementById('tab'+tab.tabindex);
      tabContent!.innerHTML = tab.content.content.to || '';
    }
  }

  resetTabs(){
    for(let tab of this.tabs){
        tab.status = false;
    }
  }

}

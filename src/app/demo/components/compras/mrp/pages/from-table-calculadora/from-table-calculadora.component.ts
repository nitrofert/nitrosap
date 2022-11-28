import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-from-table-calculadora',
  templateUrl: './from-table-calculadora.component.html',
  styleUrls: ['./from-table-calculadora.component.scss']
})
export class FromTableCalculadoraComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  
  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


}

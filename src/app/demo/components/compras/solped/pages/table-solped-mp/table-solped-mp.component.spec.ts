import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSolpedMPComponent } from './table-solped-mp.component';

describe('TableSolpedMPComponent', () => {
  let component: TableSolpedMPComponent;
  let fixture: ComponentFixture<TableSolpedMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSolpedMPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSolpedMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

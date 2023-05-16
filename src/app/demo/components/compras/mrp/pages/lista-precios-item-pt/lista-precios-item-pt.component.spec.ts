import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreciosItemPtComponent } from './lista-precios-item-pt.component';

describe('ListaPreciosItemPtComponent', () => {
  let component: ListaPreciosItemPtComponent;
  let fixture: ComponentFixture<ListaPreciosItemPtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPreciosItemPtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreciosItemPtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

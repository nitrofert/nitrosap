import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreciosItemMpComponent } from './lista-precios-item-mp.component';

describe('ListaPreciosItemMpComponent', () => {
  let component: ListaPreciosItemMpComponent;
  let fixture: ComponentFixture<ListaPreciosItemMpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPreciosItemMpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreciosItemMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

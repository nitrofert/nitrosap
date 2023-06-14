import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreciosItemSugeridoComponent } from './lista-precios-item-sugerido.component';

describe('ListaPreciosItemSugeridoComponent', () => {
  let component: ListaPreciosItemSugeridoComponent;
  let fixture: ComponentFixture<ListaPreciosItemSugeridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPreciosItemSugeridoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreciosItemSugeridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

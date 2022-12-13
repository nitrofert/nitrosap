import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoVentaComponent } from './presupuesto-venta.component';

describe('PresupuestoVentaComponent', () => {
  let component: PresupuestoVentaComponent;
  let fixture: ComponentFixture<PresupuestoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresupuestoVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

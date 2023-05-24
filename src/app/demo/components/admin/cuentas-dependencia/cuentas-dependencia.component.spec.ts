import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasDependenciaComponent } from './cuentas-dependencia.component';

describe('CuentasDependenciaComponent', () => {
  let component: CuentasDependenciaComponent;
  let fixture: ComponentFixture<CuentasDependenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasDependenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasDependenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasUsuarioComponent } from './empresas-usuario.component';

describe('EmpresasUsuarioComponent', () => {
  let component: EmpresasUsuarioComponent;
  let fixture: ComponentFixture<EmpresasUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

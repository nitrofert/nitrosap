import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionProveedoresComponent } from './evaluacion-proveedores.component';

describe('EvaluacionProveedoresComponent', () => {
  let component: EvaluacionProveedoresComponent;
  let fixture: ComponentFixture<EvaluacionProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionProveedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

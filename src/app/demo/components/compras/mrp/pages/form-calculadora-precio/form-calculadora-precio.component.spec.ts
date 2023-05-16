import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCalculadoraPrecioComponent } from './form-calculadora-precio.component';

describe('FormCalculadoraPrecioComponent', () => {
  let component: FormCalculadoraPrecioComponent;
  let fixture: ComponentFixture<FormCalculadoraPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCalculadoraPrecioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCalculadoraPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

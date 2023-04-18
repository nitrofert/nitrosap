import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraPreciosComponent } from './calculadora-precios.component';

describe('CalculadoraPreciosComponent', () => {
  let component: CalculadoraPreciosComponent;
  let fixture: ComponentFixture<CalculadoraPreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculadoraPreciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

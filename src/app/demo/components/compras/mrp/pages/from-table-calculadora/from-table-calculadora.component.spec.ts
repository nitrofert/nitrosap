import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromTableCalculadoraComponent } from './from-table-calculadora.component';

describe('FromTableCalculadoraComponent', () => {
  let component: FromTableCalculadoraComponent;
  let fixture: ComponentFixture<FromTableCalculadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromTableCalculadoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromTableCalculadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

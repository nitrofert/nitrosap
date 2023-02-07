import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionAutomaticaComponent } from './simulacion-automatica.component';

describe('SimulacionAutomaticaComponent', () => {
  let component: SimulacionAutomaticaComponent;
  let fixture: ComponentFixture<SimulacionAutomaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionAutomaticaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulacionAutomaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

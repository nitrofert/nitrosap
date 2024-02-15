import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaRelacionesComponent } from './mapa-relaciones.component';

describe('MapaRelacionesComponent', () => {
  let component: MapaRelacionesComponent;
  let fixture: ComponentFixture<MapaRelacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaRelacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaRelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

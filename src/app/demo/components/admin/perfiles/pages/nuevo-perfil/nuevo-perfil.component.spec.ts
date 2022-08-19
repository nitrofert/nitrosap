import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPerfilComponent } from './nuevo-perfil.component';

describe('NuevoPerfilComponent', () => {
  let component: NuevoPerfilComponent;
  let fixture: ComponentFixture<NuevoPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

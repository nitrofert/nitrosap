import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolpedComponent } from './editar-solped.component';

describe('EditarSolpedComponent', () => {
  let component: EditarSolpedComponent;
  let fixture: ComponentFixture<EditarSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

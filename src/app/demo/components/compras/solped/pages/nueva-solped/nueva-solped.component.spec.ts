import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolpedComponent } from './nueva-solped.component';

describe('NuevaSolpedComponent', () => {
  let component: NuevaSolpedComponent;
  let fixture: ComponentFixture<NuevaSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

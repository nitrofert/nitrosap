import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSolpedMPComponent } from './form-solped-mp.component';

describe('FormSolpedMPComponent', () => {
  let component: FormSolpedMPComponent;
  let fixture: ComponentFixture<FormSolpedMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSolpedMPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSolpedMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

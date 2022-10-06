import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSolpedComponent } from './form-solped.component';

describe('FormSolpedComponent', () => {
  let component: FormSolpedComponent;
  let fixture: ComponentFixture<FormSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

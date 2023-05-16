import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAutoresComponent } from './form-autores.component';

describe('FormAutoresComponent', () => {
  let component: FormAutoresComponent;
  let fixture: ComponentFixture<FormAutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAutoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

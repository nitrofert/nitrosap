import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrecioItemComponent } from './form-precio-item.component';

describe('FormPrecioItemComponent', () => {
  let component: FormPrecioItemComponent;
  let fixture: ComponentFixture<FormPrecioItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPrecioItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPrecioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

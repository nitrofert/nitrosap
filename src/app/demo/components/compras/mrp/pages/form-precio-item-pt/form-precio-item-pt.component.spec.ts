import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrecioItemPtComponent } from './form-precio-item-pt.component';

describe('FormPrecioItemComponent', () => {
  let component: FormPrecioItemPtComponent;
  let fixture: ComponentFixture<FormPrecioItemPtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPrecioItemPtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPrecioItemPtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

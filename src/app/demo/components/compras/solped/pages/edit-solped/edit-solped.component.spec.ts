import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSolpedComponent } from './edit-solped.component';

describe('EditSolpedComponent', () => {
  let component: EditSolpedComponent;
  let fixture: ComponentFixture<EditSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

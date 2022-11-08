import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSolpedMpComponent } from './edit-solped-mp.component';

describe('EditSolpedMpComponent', () => {
  let component: EditSolpedMpComponent;
  let fixture: ComponentFixture<EditSolpedMpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSolpedMpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSolpedMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

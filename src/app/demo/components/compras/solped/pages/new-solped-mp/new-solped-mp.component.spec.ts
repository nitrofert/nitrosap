import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSolpedMpComponent } from './new-solped-mp.component';

describe('NewSolpedMpComponent', () => {
  let component: NewSolpedMpComponent;
  let fixture: ComponentFixture<NewSolpedMpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSolpedMpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSolpedMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

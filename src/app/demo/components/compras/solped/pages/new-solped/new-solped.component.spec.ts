import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSolpedComponent } from './new-solped.component';

describe('NewSolpedComponent', () => {
  let component: NewSolpedComponent;
  let fixture: ComponentFixture<NewSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

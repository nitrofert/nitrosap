import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolpedComponent } from './solped.component';

describe('SolpedComponent', () => {
  let component: SolpedComponent;
  let fixture: ComponentFixture<SolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

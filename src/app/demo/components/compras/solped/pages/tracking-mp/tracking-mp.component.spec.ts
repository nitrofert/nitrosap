import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingMPComponent } from './tracking-mp.component';

describe('TrackingMPComponent', () => {
  let component: TrackingMPComponent;
  let fixture: ComponentFixture<TrackingMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingMPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

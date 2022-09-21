import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseApprovedComponent } from './response-approved.component';

describe('ResponseApprovedComponent', () => {
  let component: ResponseApprovedComponent;
  let fixture: ComponentFixture<ResponseApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

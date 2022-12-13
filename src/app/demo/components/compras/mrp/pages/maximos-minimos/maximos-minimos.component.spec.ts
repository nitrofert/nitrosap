import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximosMinimosComponent } from './maximos-minimos.component';

describe('MaximosMinimosComponent', () => {
  let component: MaximosMinimosComponent;
  let fixture: ComponentFixture<MaximosMinimosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximosMinimosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximosMinimosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

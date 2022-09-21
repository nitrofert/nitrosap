import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazoSolpedComponent } from './rechazo-solped.component';

describe('RechazoSolpedComponent', () => {
  let component: RechazoSolpedComponent;
  let fixture: ComponentFixture<RechazoSolpedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechazoSolpedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechazoSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

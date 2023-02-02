import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolpedsAprobadasComponent } from './solpeds-aprobadas.component';

describe('SolpedsAprobadasComponent', () => {
  let component: SolpedsAprobadasComponent;
  let fixture: ComponentFixture<SolpedsAprobadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolpedsAprobadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolpedsAprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

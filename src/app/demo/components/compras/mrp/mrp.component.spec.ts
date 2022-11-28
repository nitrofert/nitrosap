import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrpComponent } from './mrp.component';

describe('MrpComponent', () => {
  let component: MrpComponent;
  let fixture: ComponentFixture<MrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

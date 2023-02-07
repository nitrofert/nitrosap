import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTabmenuComponent } from './dynamic-tabmenu.component';

describe('DynamicTabmenuComponent', () => {
  let component: DynamicTabmenuComponent;
  let fixture: ComponentFixture<DynamicTabmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTabmenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTabmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

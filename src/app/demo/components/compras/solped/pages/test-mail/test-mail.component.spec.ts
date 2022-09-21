import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMailComponent } from './test-mail.component';

describe('TestMailComponent', () => {
  let component: TestMailComponent;
  let fixture: ComponentFixture<TestMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

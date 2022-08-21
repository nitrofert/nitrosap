import { TestBed } from '@angular/core/testing';

import { RoleAccesGuard } from './role-acces.guard';

describe('RoleAccesGuard', () => {
  let guard: RoleAccesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleAccesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

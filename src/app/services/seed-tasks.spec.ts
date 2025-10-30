import { TestBed } from '@angular/core/testing';

import { SeedTasks } from './seed-tasks';

describe('SeedTasks', () => {
  let service: SeedTasks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeedTasks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

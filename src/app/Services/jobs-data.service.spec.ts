import { TestBed } from '@angular/core/testing';

import { JobsDataService } from './jobs-data.service';

describe('JobsDataService', () => {
  let service: JobsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

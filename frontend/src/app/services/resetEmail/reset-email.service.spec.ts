import { TestBed } from '@angular/core/testing';

import { ResetEmailService } from './reset-email.service';

describe('ResetEmailService', () => {
  let service: ResetEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PersonalizarService } from './personalizar.service';

describe('PersonalizarService', () => {
  let service: PersonalizarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalizarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

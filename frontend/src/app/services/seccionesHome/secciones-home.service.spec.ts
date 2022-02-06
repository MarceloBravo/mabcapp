import { TestBed } from '@angular/core/testing';

import { SeccionesHomeService } from './secciones-home.service';

describe('SeccionesHomeService', () => {
  let service: SeccionesHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionesHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

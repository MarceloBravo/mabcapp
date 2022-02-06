import { TestBed } from '@angular/core/testing';

import { TallasService } from './tallas.service';

describe('TallasService', () => {
  let service: TallasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TallasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ConfigOfertaService } from './config-oferta.service';

describe('ConfigOfertaService', () => {
  let service: ConfigOfertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigOfertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

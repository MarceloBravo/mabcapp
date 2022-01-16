import { TestBed } from '@angular/core/testing';

import { CuadroMandoService } from './cuadro-mando.service';

describe('CuadroMandoService', () => {
  let service: CuadroMandoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuadroMandoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

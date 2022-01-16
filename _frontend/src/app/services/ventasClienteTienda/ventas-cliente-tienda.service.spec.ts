import { TestBed } from '@angular/core/testing';

import { VentasClienteTiendaService } from './ventas-cliente-tienda.service';

describe('VentasClienteTiendaService', () => {
  let service: VentasClienteTiendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasClienteTiendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

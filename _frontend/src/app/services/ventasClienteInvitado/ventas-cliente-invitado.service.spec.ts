import { TestBed } from '@angular/core/testing';

import { VentasClienteInvitadoService } from './ventas-cliente-invitado.service';

describe('VentasClienteInvitadoService', () => {
  let service: VentasClienteInvitadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasClienteInvitadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

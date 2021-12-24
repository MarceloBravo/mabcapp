import { TestBed } from '@angular/core/testing';

import { ClientesLoginService } from './clientes-login.service';

describe('ClientesLoginService', () => {
  let service: ClientesLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

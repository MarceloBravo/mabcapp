import { TestBed } from '@angular/core/testing';

import { LoginClientesService } from './login-clientes.service';

describe('LoginClientesService', () => {
  let service: LoginClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

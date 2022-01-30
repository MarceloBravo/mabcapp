import { TestBed } from '@angular/core/testing';

import { ConfigMarquesinaService } from './config-marquesina.service';

describe('ConfigMarquesinaService', () => {
  let service: ConfigMarquesinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigMarquesinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

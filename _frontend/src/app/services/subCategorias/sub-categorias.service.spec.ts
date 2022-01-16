import { TestBed } from '@angular/core/testing';

import { SubCategoriasService } from './sub-categorias.service';

describe('SubCategoriasService', () => {
  let service: SubCategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

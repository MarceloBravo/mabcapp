import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasGridComponent } from './categorias-grid.component';

describe('CategoriasGridComponent', () => {
  let component: CategoriasGridComponent;
  let fixture: ComponentFixture<CategoriasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

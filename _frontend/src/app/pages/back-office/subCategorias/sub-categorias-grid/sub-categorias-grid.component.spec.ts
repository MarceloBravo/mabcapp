import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriasGridComponent } from './sub-categorias-grid.component';

describe('SubCategoriasGridComponent', () => {
  let component: SubCategoriasGridComponent;
  let fixture: ComponentFixture<SubCategoriasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoriasGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoriasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

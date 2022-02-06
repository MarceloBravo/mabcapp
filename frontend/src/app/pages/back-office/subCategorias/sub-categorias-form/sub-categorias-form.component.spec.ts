import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriasFormComponent } from './sub-categorias-form.component';

describe('SubCategoriasFormComponent', () => {
  let component: SubCategoriasFormComponent;
  let fixture: ComponentFixture<SubCategoriasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoriasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoriasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

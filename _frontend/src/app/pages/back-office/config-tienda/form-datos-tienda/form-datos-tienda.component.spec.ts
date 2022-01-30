import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosTiendaComponent } from './form-datos-tienda.component';

describe('FormDatosTiendaComponent', () => {
  let component: FormDatosTiendaComponent;
  let fixture: ComponentFixture<FormDatosTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDatosTiendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDatosTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

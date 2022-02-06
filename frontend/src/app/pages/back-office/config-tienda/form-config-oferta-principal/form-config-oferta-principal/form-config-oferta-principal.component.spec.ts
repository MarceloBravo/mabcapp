import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigOfertaPrincipalComponent } from './form-config-oferta-principal.component';

describe('FormConfigOfertaPrincipalComponent', () => {
  let component: FormConfigOfertaPrincipalComponent;
  let fixture: ComponentFixture<FormConfigOfertaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConfigOfertaPrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfigOfertaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

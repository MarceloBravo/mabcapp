import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDespachoComponent } from './datos-despacho.component';

describe('DatosDespachoComponent', () => {
  let component: DatosDespachoComponent;
  let fixture: ComponentFixture<DatosDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

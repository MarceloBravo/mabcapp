import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoTransaccionComponent } from './resultado-transaccion.component';

describe('ResultadoTransaccionComponent', () => {
  let component: ResultadoTransaccionComponent;
  let fixture: ComponentFixture<ResultadoTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoTransaccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

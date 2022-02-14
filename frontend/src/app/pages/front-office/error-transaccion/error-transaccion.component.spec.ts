import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorTransaccionComponent } from './error-transaccion.component';

describe('ErrorTransaccionComponent', () => {
  let component: ErrorTransaccionComponent;
  let fixture: ComponentFixture<ErrorTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorTransaccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

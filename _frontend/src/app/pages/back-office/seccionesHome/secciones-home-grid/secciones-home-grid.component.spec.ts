import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionesHomeGridComponent } from './secciones-home-grid.component';

describe('SeccionesHomeGridComponent', () => {
  let component: SeccionesHomeGridComponent;
  let fixture: ComponentFixture<SeccionesHomeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionesHomeGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionesHomeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

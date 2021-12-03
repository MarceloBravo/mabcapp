import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionesHomeFormComponent } from './secciones-home-form.component';

describe('SeccionesHomeFormComponent', () => {
  let component: SeccionesHomeFormComponent;
  let fixture: ComponentFixture<SeccionesHomeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionesHomeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionesHomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

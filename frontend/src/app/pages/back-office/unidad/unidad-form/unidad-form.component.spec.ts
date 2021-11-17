import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadFormComponent } from './unidad-form.component';

describe('UnidadFormComponent', () => {
  let component: UnidadFormComponent;
  let fixture: ComponentFixture<UnidadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

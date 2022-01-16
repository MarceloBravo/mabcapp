import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigMarquesinaHomeComponent } from './form-config-marquesina-home.component';

describe('FormConfigMarquesinaHomeComponent', () => {
  let component: FormConfigMarquesinaHomeComponent;
  let fixture: ComponentFixture<FormConfigMarquesinaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConfigMarquesinaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfigMarquesinaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

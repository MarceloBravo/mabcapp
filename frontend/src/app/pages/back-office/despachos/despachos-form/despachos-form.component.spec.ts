import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespachosFormComponent } from './despachos-form.component';

describe('DespachosFormComponent', () => {
  let component: DespachosFormComponent;
  let fixture: ComponentFixture<DespachosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespachosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DespachosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

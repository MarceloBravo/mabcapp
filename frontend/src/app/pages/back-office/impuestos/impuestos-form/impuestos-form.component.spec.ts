import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuestosFormComponent } from './impuestos-form.component';

describe('ImpuestosFormComponent', () => {
  let component: ImpuestosFormComponent;
  let fixture: ComponentFixture<ImpuestosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuestosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuestosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

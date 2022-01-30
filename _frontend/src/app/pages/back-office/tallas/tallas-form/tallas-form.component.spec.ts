import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallasFormComponent } from './tallas-form.component';

describe('TallasFormComponent', () => {
  let component: TallasFormComponent;
  let fixture: ComponentFixture<TallasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuestosGridComponent } from './impuestos-grid.component';

describe('ImpuestosGridComponent', () => {
  let component: ImpuestosGridComponent;
  let fixture: ComponentFixture<ImpuestosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuestosGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuestosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

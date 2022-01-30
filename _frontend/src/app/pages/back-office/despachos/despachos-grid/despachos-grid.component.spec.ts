import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespachosGridComponent } from './despachos-grid.component';

describe('DespachosGridComponent', () => {
  let component: DespachosGridComponent;
  let fixture: ComponentFixture<DespachosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespachosGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DespachosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

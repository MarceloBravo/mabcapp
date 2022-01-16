import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadGridComponent } from './unidad-grid.component';

describe('UnidadGridComponent', () => {
  let component: UnidadGridComponent;
  let fixture: ComponentFixture<UnidadGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosGridComponent } from './productos-grid.component';

describe('ProductosGridComponent', () => {
  let component: ProductosGridComponent;
  let fixture: ComponentFixture<ProductosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

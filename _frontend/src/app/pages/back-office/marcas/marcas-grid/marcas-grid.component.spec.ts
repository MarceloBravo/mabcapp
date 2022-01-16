import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasGridComponent } from './marcas-grid.component';

describe('MarcasGridComponent', () => {
  let component: MarcasGridComponent;
  let fixture: ComponentFixture<MarcasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcasGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

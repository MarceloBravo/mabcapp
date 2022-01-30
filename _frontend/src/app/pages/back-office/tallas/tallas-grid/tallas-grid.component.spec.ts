import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallasGridComponent } from './tallas-grid.component';

describe('TallasGridComponent', () => {
  let component: TallasGridComponent;
  let fixture: ComponentFixture<TallasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallasGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

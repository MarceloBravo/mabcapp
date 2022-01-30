import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFooterComponent } from './fo-footer.component';

describe('FoFooterComponent', () => {
  let component: FoFooterComponent;
  let fixture: ComponentFixture<FoFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

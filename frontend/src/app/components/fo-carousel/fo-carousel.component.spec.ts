import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoCarouselComponent } from './fo-carousel.component';

describe('FoCarouselComponent', () => {
  let component: FoCarouselComponent;
  let fixture: ComponentFixture<FoCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

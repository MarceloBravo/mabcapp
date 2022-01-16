import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoHeaderNavbarComponent } from './fo-header-navbar.component';

describe('FoHeaderNavbarComponent', () => {
  let component: FoHeaderNavbarComponent;
  let fixture: ComponentFixture<FoHeaderNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoHeaderNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoHeaderNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSessionComponent } from './info-session.component';

describe('InfoSessionComponent', () => {
  let component: InfoSessionComponent;
  let fixture: ComponentFixture<InfoSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

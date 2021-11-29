import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTiendaComponent } from './config-tienda.component';

describe('ConfigTiendaComponent', () => {
  let component: ConfigTiendaComponent;
  let fixture: ComponentFixture<ConfigTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigTiendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

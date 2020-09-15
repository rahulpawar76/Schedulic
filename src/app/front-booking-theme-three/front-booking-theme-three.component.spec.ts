import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontBookingThemeThreeComponent } from './front-booking-theme-three.component';

describe('FrontBookingThemeThreeComponent', () => {
  let component: FrontBookingThemeThreeComponent;
  let fixture: ComponentFixture<FrontBookingThemeThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontBookingThemeThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontBookingThemeThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

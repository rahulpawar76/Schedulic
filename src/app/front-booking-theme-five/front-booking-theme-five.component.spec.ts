import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontBookingThemeFiveComponent } from './front-booking-theme-five.component';

describe('FrontBookingThemeFiveComponent', () => {
  let component: FrontBookingThemeFiveComponent;
  let fixture: ComponentFixture<FrontBookingThemeFiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontBookingThemeFiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontBookingThemeFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

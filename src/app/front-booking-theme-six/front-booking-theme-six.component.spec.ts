import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontBookingThemeSixComponent } from './front-booking-theme-six.component';

describe('FrontBookingThemeSixComponent', () => {
  let component: FrontBookingThemeSixComponent;
  let fixture: ComponentFixture<FrontBookingThemeSixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontBookingThemeSixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontBookingThemeSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

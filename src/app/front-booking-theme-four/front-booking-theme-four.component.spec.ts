import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontBookingThemeFourComponent } from './front-booking-theme-four.component';

describe('FrontBookingThemeFourComponent', () => {
  let component: FrontBookingThemeFourComponent;
  let fixture: ComponentFixture<FrontBookingThemeFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontBookingThemeFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontBookingThemeFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

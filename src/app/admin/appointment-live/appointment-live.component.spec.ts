import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLiveComponent } from './appointment-live.component';

describe('AppointmentLiveComponent', () => {
  let component: AppointmentLiveComponent;
  let fixture: ComponentFixture<AppointmentLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

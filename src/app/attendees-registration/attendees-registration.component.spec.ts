import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesRegistrationComponent } from './attendees-registration.component';

describe('AttendeesRegistrationComponent', () => {
  let component: AttendeesRegistrationComponent;
  let fixture: ComponentFixture<AttendeesRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeesRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappointmentsComponent } from './userappointments.component';

describe('UserappointmentsComponent', () => {
  let component: UserappointmentsComponent;
  let fixture: ComponentFixture<UserappointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserappointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
